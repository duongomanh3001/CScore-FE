package iuh.fit.cscore_be.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.cscore_be.dto.response.CodeExecutionResponse;
import iuh.fit.cscore_be.dto.response.TestResultResponse;
import iuh.fit.cscore_be.entity.TestCase;
import iuh.fit.cscore_be.enums.ProgrammingLanguage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class Judge0Service {
    
    @Value("${judge0.url:https://judge0-ce.p.rapidapi.com}")
    private String judge0Url;
    
    @Value("${judge0.api.key:your-rapidapi-key}")
    private String rapidApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public CodeExecutionResponse executeCode(String code, ProgrammingLanguage language, List<TestCase> testCases) {
        try {
            List<TestResultResponse> testResults = new ArrayList<>();
            double totalScore = 0.0;
            double maxScore = testCases.stream().mapToDouble(TestCase::getWeight).sum();
            
            for (TestCase testCase : testCases) {
                CodeExecutionResponse.TestCaseResult result = executeTestCase(code, language, testCase);
                
                // Convert TestCaseResult to TestResultResponse
                TestResultResponse testResultResponse = new TestResultResponse();
                testResultResponse.setTestCaseId(result.getTestCaseId());
                testResultResponse.setInput(testCase.getInput());
                testResultResponse.setExpectedOutput(result.getExpectedOutput());
                testResultResponse.setActualOutput(result.getActualOutput());
                testResultResponse.setPassed(result.getPassed());
                testResultResponse.setExecutionTime(result.getExecutionTime() != null ? result.getExecutionTime().longValue() : 0L);
                testResultResponse.setErrorMessage(result.getErrorMessage());
                testResultResponse.setWeight(result.getWeight());
                testResultResponse.setHidden(testCase.getIsHidden());
                
                testResults.add(testResultResponse);
                
                if (result.getPassed()) {
                    totalScore += result.getWeight();
                }
            }
            
            // Calculate final score as percentage
            double finalScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
            
            CodeExecutionResponse response = new CodeExecutionResponse();
            response.setTestResults(testResults);
            response.setScore(finalScore);
            response.setStatus("completed");
            
            return response;
            
        } catch (Exception e) {
            log.error("Error executing code with Judge0", e);
            CodeExecutionResponse errorResponse = new CodeExecutionResponse();
            errorResponse.setStatus("error");
            errorResponse.setStderr("Internal server error during code execution");
            return errorResponse;
        }
    }
    
    private CodeExecutionResponse.TestCaseResult executeTestCase(String code, ProgrammingLanguage language, TestCase testCase) {
        try {
            // Create submission
            String submissionData = createSubmissionJson(code, language, testCase.getInput());
            String submissionToken = submitCode(submissionData);
            
            if (submissionToken == null) {
                return createErrorResult(testCase, "Failed to submit code");
            }
            
            // Wait and get result
            JsonNode result = getSubmissionResult(submissionToken);
            
            if (result == null) {
                return createErrorResult(testCase, "Failed to get execution result");
            }
            
            return processTestCaseResult(testCase, result);
            
        } catch (Exception e) {
            log.error("Error executing test case", e);
            return createErrorResult(testCase, "Execution error: " + e.getMessage());
        }
    }
    
    private String createSubmissionJson(String code, ProgrammingLanguage language, String input) {
        try {
            String encodedCode = Base64.getEncoder().encodeToString(code.getBytes());
            String encodedInput = input != null ? Base64.getEncoder().encodeToString(input.getBytes()) : "";
            
            return String.format(
                "{"
                + "\"source_code\":\"%s\","
                + "\"language_id\":%d,"
                + "\"stdin\":\"%s\","
                + "\"expected_output\":\"\""
                + "}",
                encodedCode, language.getJudge0Id(), encodedInput
            );
        } catch (Exception e) {
            log.error("Error creating submission JSON", e);
            return null;
        }
    }
    
    private String submitCode(String submissionData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-RapidAPI-Key", rapidApiKey);
            headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");
            
            HttpEntity<String> entity = new HttpEntity<>(submissionData, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(
                judge0Url + "/submissions?base64_encoded=true&wait=false",
                entity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.CREATED) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                return jsonResponse.get("token").asText();
            }
            
        } catch (Exception e) {
            log.error("Error submitting code to Judge0", e);
        }
        
        return null;
    }
    
    private JsonNode getSubmissionResult(String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", rapidApiKey);
            headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // Wait for execution to complete
            for (int i = 0; i < 10; i++) {
                ResponseEntity<String> response = restTemplate.exchange(
                    judge0Url + "/submissions/" + token + "?base64_encoded=true",
                    HttpMethod.GET,
                    entity,
                    String.class
                );
                
                if (response.getStatusCode() == HttpStatus.OK) {
                    JsonNode result = objectMapper.readTree(response.getBody());
                    JsonNode status = result.get("status");
                    
                    if (status != null && status.get("id").asInt() > 2) {
                        // Execution completed (status id > 2 means finished)
                        return result;
                    }
                }
                
                // Wait before next poll
                TimeUnit.MILLISECONDS.sleep(500);
            }
            
        } catch (Exception e) {
            log.error("Error getting submission result from Judge0", e);
        }
        
        return null;
    }
    
    private CodeExecutionResponse.TestCaseResult processTestCaseResult(TestCase testCase, JsonNode result) {
        try {
            String stdout = decodeBase64(result.get("stdout"));
            String stderr = decodeBase64(result.get("stderr"));
            String compileOutput = decodeBase64(result.get("compile_output"));
            
            JsonNode status = result.get("status");
            int statusId = status.get("id").asInt();
            
            boolean passed = false;
            String errorMessage = null;
            
            if (statusId == 3) { // Accepted
                String actualOutput = stdout != null ? stdout.trim() : "";
                String expectedOutput = testCase.getExpectedOutput().trim();
                passed = actualOutput.equals(expectedOutput);
                
                if (!passed) {
                    errorMessage = "Output mismatch";
                }
            } else {
                // Handle different error types
                switch (statusId) {
                    case 4:
                        errorMessage = "Wrong Answer";
                        break;
                    case 5:
                        errorMessage = "Time Limit Exceeded";
                        break;
                    case 6:
                        errorMessage = "Compilation Error: " + (compileOutput != null ? compileOutput : "");
                        break;
                    case 7:
                        errorMessage = "Runtime Error (SIGSEGV)";
                        break;
                    case 8:
                        errorMessage = "Runtime Error (SIGXFSZ)";
                        break;
                    case 9:
                        errorMessage = "Runtime Error (SIGFPE)";
                        break;
                    case 10:
                        errorMessage = "Runtime Error (SIGABRT)";
                        break;
                    case 11:
                        errorMessage = "Runtime Error (NZEC)";
                        break;
                    case 12:
                        errorMessage = "Runtime Error (Other)";
                        break;
                    case 13:
                        errorMessage = "Internal Error";
                        break;
                    case 14:
                        errorMessage = "Exec Format Error";
                        break;
                    default:
                        errorMessage = "Unknown Error";
                }
                
                if (stderr != null && !stderr.trim().isEmpty()) {
                    errorMessage += ": " + stderr;
                }
            }
            
            Double executionTime = result.has("time") ? result.get("time").asDouble() : 0.0;
            
            return new CodeExecutionResponse.TestCaseResult(
                testCase.getId(),
                passed,
                stdout != null ? stdout.trim() : "",
                testCase.getExpectedOutput(),
                errorMessage,
                executionTime,
                testCase.getWeight()
            );
            
        } catch (Exception e) {
            log.error("Error processing test case result", e);
            return createErrorResult(testCase, "Error processing result");
        }
    }
    
    private CodeExecutionResponse.TestCaseResult createErrorResult(TestCase testCase, String errorMessage) {
        return new CodeExecutionResponse.TestCaseResult(
            testCase.getId(),
            false,
            "",
            testCase.getExpectedOutput(),
            errorMessage,
            0.0,
            testCase.getWeight()
        );
    }
    
    private String decodeBase64(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        try {
            return new String(Base64.getDecoder().decode(node.asText()));
        } catch (Exception e) {
            return node.asText();
        }
    }
}
