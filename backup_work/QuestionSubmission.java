package iuh.fit.cscore_be.entity;

import iuh.fit.cscore_be.enums.SubmissionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "question_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(columnDefinition = "TEXT")
    private String code;

    @Column(name = "programming_language", length = 50)
    private String programmingLanguage;

    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    private Double score = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status = SubmissionStatus.NOT_SUBMITTED;

    @Column(name = "execution_time")
    private Long executionTime;

    @Column(name = "memory_used")
    private Long memoryUsed;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "graded_time")
    private LocalDateTime gradedTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
