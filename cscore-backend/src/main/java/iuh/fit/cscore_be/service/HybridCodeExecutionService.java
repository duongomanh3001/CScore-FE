package iuh.fit.cscore_be.service;

import iuh.fit.cscore_be.dto.response.CodeExecutionResponse;
import iuh.fit.cscore_be.entity.Submission;
import iuh.fit.cscore_be.entity.TestCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HybridCodeExecutionService {

    private final JobeExecutionService jobeExecutionService;
    private final CodeExecutionService localCodeExecutionService;
    
    @Value("${execution.strategy:hybrid}")
    private String executionStrategy; // hybrid, jobe, local
    
    @Value("${jobe.server.enabled:false}")
    private boolean jobeEnabled;

    /**
     * Execute code using the configured strategy
     */
    public CodeExecutionResponse executeCode(String code, String language) {
        ExecutionStrategy strategy = determineExecutionStrategy();
        
        log.info("Executing code using strategy: {} for language: {}", strategy, language);
        
        switch (strategy) {
            case JOBE:
                return executeWithJobe(code, language);
            case LOCAL:
                return executeWithLocal(code, language);
            case HYBRID:
            default:
                return executeWithHybrid(code, language);
        }
    }

    /**
     * Execute code with input using the configured strategy
     */
    public CodeExecutionResponse executeCodeWithInput(String code, String language, String input) {
        ExecutionStrategy strategy = determineExecutionStrategy();
        
        log.info("Executing code with input using strategy: {} for language: {}", strategy, language);
        
        switch (strategy) {
            case JOBE:
                return executeWithInputJobe(code, language, input);
            case LOCAL:
                return executeWithInputLocal(code, language, input);
            case HYBRID:
            default:
                return executeWithInputHybrid(code, language, input);
        }
    }

    /**
     * Execute code with test cases using the configured strategy
     */
    public CodeExecutionResponse executeCodeWithTestCases(String code, String language, List<TestCase> testCases, Submission submission) {
        ExecutionStrategy strategy = determineExecutionStrategy();
        
        log.info("Executing code with {} test cases using strategy: {} for language: {}", 
                testCases.size(), strategy, language);
        
        switch (strategy) {
            case JOBE:
                return executeWithTestCasesJobe(code, language, testCases, submission);
            case LOCAL:
                return executeWithTestCasesLocal(code, language, testCases, submission);
            case HYBRID:
            default:
                return executeWithTestCasesHybrid(code, language, testCases, submission);
        }
    }

    /**
     * Determine execution strategy based on configuration and availability
     */
    private ExecutionStrategy determineExecutionStrategy() {
        switch (executionStrategy.toLowerCase()) {
            case "jobe":
                return jobeEnabled && jobeExecutionService.isJobeServerAvailable() ? 
                       ExecutionStrategy.JOBE : ExecutionStrategy.LOCAL;
            case "local":
                return ExecutionStrategy.LOCAL;
            case "hybrid":
            default:
                return jobeEnabled && jobeExecutionService.isJobeServerAvailable() ? 
                       ExecutionStrategy.JOBE : ExecutionStrategy.LOCAL;
        }
    }

    // JOBE execution methods
    private CodeExecutionResponse executeWithJobe(String code, String language) {
        try {
            return jobeExecutionService.executeCode(code, language);
        } catch (Exception e) {
            log.warn("Jobe execution failed, falling back to local: {}", e.getMessage());
            return localCodeExecutionService.executeCode(code, language);
        }
    }

    private CodeExecutionResponse executeWithInputJobe(String code, String language, String input) {
        try {
            return jobeExecutionService.executeCodeWithInput(code, language, input);
        } catch (Exception e) {
            log.warn("Jobe execution with input failed, falling back to local: {}", e.getMessage());
            return localCodeExecutionService.executeCodeWithInput(code, language, input);
        }
    }

    private CodeExecutionResponse executeWithTestCasesJobe(String code, String language, List<TestCase> testCases, Submission submission) {
        try {
            return jobeExecutionService.executeCodeWithTestCases(code, language, testCases, submission);
        } catch (Exception e) {
            log.warn("Jobe execution with test cases failed, falling back to local: {}", e.getMessage());
            return localCodeExecutionService.executeCodeWithTestCases(code, language, testCases, submission);
        }
    }

    // LOCAL execution methods
    private CodeExecutionResponse executeWithLocal(String code, String language) {
        return localCodeExecutionService.executeCode(code, language);
    }

    private CodeExecutionResponse executeWithInputLocal(String code, String language, String input) {
        return localCodeExecutionService.executeCodeWithInput(code, language, input);
    }

    private CodeExecutionResponse executeWithTestCasesLocal(String code, String language, List<TestCase> testCases, Submission submission) {
        return localCodeExecutionService.executeCodeWithTestCases(code, language, testCases, submission);
    }

    // HYBRID execution methods (with fallback)
    private CodeExecutionResponse executeWithHybrid(String code, String language) {
        if (jobeEnabled && jobeExecutionService.isJobeServerAvailable()) {
            try {
                CodeExecutionResponse result = jobeExecutionService.executeCode(code, language);
                if (result.isSuccess()) {
                    return result;
                }
                log.warn("Jobe execution unsuccessful, falling back to local");
            } catch (Exception e) {
                log.warn("Jobe execution failed, falling back to local: {}", e.getMessage());
            }
        }
        
        return localCodeExecutionService.executeCode(code, language);
    }

    private CodeExecutionResponse executeWithInputHybrid(String code, String language, String input) {
        if (jobeEnabled && jobeExecutionService.isJobeServerAvailable()) {
            try {
                CodeExecutionResponse result = jobeExecutionService.executeCodeWithInput(code, language, input);
                if (result.isSuccess()) {
                    return result;
                }
                log.warn("Jobe execution with input unsuccessful, falling back to local");
            } catch (Exception e) {
                log.warn("Jobe execution with input failed, falling back to local: {}", e.getMessage());
            }
        }
        
        return localCodeExecutionService.executeCodeWithInput(code, language, input);
    }

    private CodeExecutionResponse executeWithTestCasesHybrid(String code, String language, List<TestCase> testCases, Submission submission) {
        if (jobeEnabled && jobeExecutionService.isJobeServerAvailable()) {
            try {
                CodeExecutionResponse result = jobeExecutionService.executeCodeWithTestCases(code, language, testCases, submission);
                if (result.isSuccess()) {
                    return result;
                }
                log.warn("Jobe execution with test cases unsuccessful, falling back to local");
            } catch (Exception e) {
                log.warn("Jobe execution with test cases failed, falling back to local: {}", e.getMessage());
            }
        }
        
        return localCodeExecutionService.executeCodeWithTestCases(code, language, testCases, submission);
    }

    /**
     * Get execution status and strategy info
     */
    public ExecutionInfo getExecutionInfo() {
        ExecutionInfo info = new ExecutionInfo();
        info.setCurrentStrategy(determineExecutionStrategy());
        info.setJobeEnabled(jobeEnabled);
        info.setJobeAvailable(jobeEnabled && jobeExecutionService.isJobeServerAvailable());
        info.setConfiguredStrategy(executionStrategy);
        
        if (info.isJobeAvailable()) {
            info.setSupportedLanguages(jobeExecutionService.getSupportedLanguages());
        }
        
        return info;
    }

    // Enums and DTOs
    public enum ExecutionStrategy {
        JOBE, LOCAL, HYBRID
    }

    public static class ExecutionInfo {
        private ExecutionStrategy currentStrategy;
        private boolean jobeEnabled;
        private boolean jobeAvailable;
        private String configuredStrategy;
        private List<String> supportedLanguages;

        // Getters and setters
        public ExecutionStrategy getCurrentStrategy() { return currentStrategy; }
        public void setCurrentStrategy(ExecutionStrategy currentStrategy) { this.currentStrategy = currentStrategy; }
        
        public boolean isJobeEnabled() { return jobeEnabled; }
        public void setJobeEnabled(boolean jobeEnabled) { this.jobeEnabled = jobeEnabled; }
        
        public boolean isJobeAvailable() { return jobeAvailable; }
        public void setJobeAvailable(boolean jobeAvailable) { this.jobeAvailable = jobeAvailable; }
        
        public String getConfiguredStrategy() { return configuredStrategy; }
        public void setConfiguredStrategy(String configuredStrategy) { this.configuredStrategy = configuredStrategy; }
        
        public List<String> getSupportedLanguages() { return supportedLanguages; }
        public void setSupportedLanguages(List<String> supportedLanguages) { this.supportedLanguages = supportedLanguages; }
    }
}
