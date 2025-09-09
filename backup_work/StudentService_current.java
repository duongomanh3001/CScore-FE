package iuh.fit.cscore_be.service;

import iuh.fit.cscore_be.dto.request.SubmissionRequest;
import iuh.fit.cscore_be.dto.response.SubmissionResponse;
import iuh.fit.cscore_be.entity.*;
import iuh.fit.cscore_be.enums.SubmissionStatus;
import iuh.fit.cscore_be.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentService {
    
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final AutoGradingService autoGradingService;
    
    // Temporarily commented out to avoid compilation errors
    // private final QuestionSubmissionRepository questionSubmissionRepository;

    @Transactional
    public SubmissionResponse submitAssignment(Long assignmentId, SubmissionRequest request) {
        log.info("Processing assignment submission for assignmentId: {}, studentId: {}", 
                assignmentId, request.getStudentId());

        // Validate assignment exists
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));

        // Check if assignment is active
        if (!assignment.getIsActive()) {
            throw new RuntimeException("Assignment is not active");
        }

        // Check deadline
        if (LocalDateTime.now().isAfter(assignment.getEndTime())) {
            if (!assignment.getAllowLateSubmission()) {
                throw new RuntimeException("Assignment submission deadline has passed");
            }
        }

        // Find or create submission
        Optional<Submission> existingSubmission = submissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, request.getStudentId());

        Submission submission;
        if (existingSubmission.isPresent()) {
            submission = existingSubmission.get();
            log.info("Found existing submission with ID: {}", submission.getId());
        } else {
            submission = new Submission();
            submission.setAssignmentId(assignmentId);
            submission.setStudentId(request.getStudentId());
            submission.setSubmittedAt(LocalDateTime.now());
            log.info("Creating new submission for student: {} and assignment: {}", 
                    request.getStudentId(), assignmentId);
        }

        // Update submission with new data
        submission.setCode(request.getCode());
        submission.setLanguage(request.getLanguage());
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setUpdatedAt(LocalDateTime.now());

        // Save submission first
        submission = submissionRepository.save(submission);
        log.info("Saved submission with ID: {}", submission.getId());

        // Auto-grade if enabled
        if (assignment.getAutoGrade()) {
            try {
                log.info("Starting auto-grading for submission: {}", submission.getId());
                autoGradingService.gradeSubmission(submission.getId());
                
                // Reload submission to get updated score
                submission = submissionRepository.findById(submission.getId())
                        .orElse(submission);
                
                log.info("Auto-grading completed for submission: {}, final score: {}", 
                        submission.getId(), submission.getScore());
            } catch (Exception e) {
                log.error("Auto-grading failed for submission: {}, error: {}", 
                        submission.getId(), e.getMessage(), e);
                submission.setStatus(SubmissionStatus.FAILED);
                submission = submissionRepository.save(submission);
            }
        }

        return SubmissionResponse.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignmentId())
                .studentId(submission.getStudentId())
                .code(submission.getCode())
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .score(submission.getScore())
                .maxScore(assignment.getMaxScore())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }
}
