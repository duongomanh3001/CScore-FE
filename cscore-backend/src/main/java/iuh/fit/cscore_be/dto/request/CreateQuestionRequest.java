package iuh.fit.cscore_be.dto.request;

import iuh.fit.cscore_be.enums.QuestionType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuestionRequest {
    
    @NotBlank(message = "Tiêu đề câu hỏi không được trống")
    @Size(min = 3, max = 500, message = "Tiêu đề câu hỏi phải từ 3 đến 500 ký tự")
    private String title;
    
    @Size(max = 5000, message = "Mô tả câu hỏi không được vượt quá 5000 ký tự")
    private String description;
    
    @NotNull(message = "Loại câu hỏi không được trống")
    private QuestionType questionType;
    
    @DecimalMin(value = "0.1", message = "Điểm số phải lớn hơn 0")
    @DecimalMax(value = "100.0", message = "Điểm số không được vượt quá 100")
    private Double points;
    
    @Min(value = 0, message = "Thứ tự câu hỏi không được âm")
    private Integer orderIndex;
    
    private List<CreateTestCaseRequest> testCases;
    
    private List<CreateQuestionOptionRequest> options;
}
