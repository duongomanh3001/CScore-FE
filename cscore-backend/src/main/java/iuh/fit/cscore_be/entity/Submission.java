package iuh.fit.cscore_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import iuh.fit.cscore_be.enums.SubmissionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    @JsonIgnore
    private Assignment assignment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private User student;
    
    @Column(columnDefinition = "TEXT")
    private String code;
    
    @Column(name = "programming_language")
    private String programmingLanguage;
    
    @Enumerated(EnumType.STRING)
    private SubmissionStatus status = SubmissionStatus.SUBMITTED;
    
    @Column(name = "score")
    private Double score;
    
    @Column(name = "execution_time")
    private Long executionTime; // milliseconds
    
    @Column(name = "memory_used")
    private Long memoryUsed; // bytes
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    @Column(name = "submission_time")
    private LocalDateTime submissionTime;
    
    @Column(name = "graded_time")
    private LocalDateTime gradedTime;
    
    // New fields for multi-question support
    @Column(name = "total_questions")
    private Integer totalQuestions = 0;
    
    @Column(name = "completed_questions") 
    private Integer completedQuestions = 0;
    
    @Column(name = "has_programming_questions")
    private Boolean hasProgrammingQuestions = false;
    
    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TestResult> testResults = new ArrayList<>();
    
    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<QuestionSubmission> questionSubmissions = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        submissionTime = LocalDateTime.now();
    }
}
