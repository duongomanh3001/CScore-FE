// Demo Assignment Creation Data
// Này là dữ liệu mẫu để test tính năng tạo bài tập

export const sampleAssignment = {
  title: "Bài tập Lập trình Cơ bản - Tuần 3",
  description: "Bài tập này bao gồm các câu hỏi về lập trình cơ bản, kiểm tra khả năng viết code và hiểu biết lý thuyết của sinh viên.",
  type: "EXERCISE",
  courseId: 1, // Cần chọn từ danh sách khóa học
  timeLimit: 90, // 90 phút
  allowLateSubmission: true,
  autoGrade: true,
  questions: [
    // Câu 1: Lập trình - Tính tổng 2 số
    {
      title: "Tính tổng hai số nguyên",
      description: `Viết chương trình đọc vào hai số nguyên a và b, sau đó in ra tổng của chúng.

Yêu cầu:
- Đọc hai số nguyên từ input
- In ra tổng của hai số
- Không cần xử lý trường hợp đặc biệt

Ví dụ:
Input: 3 5
Output: 8`,
      questionType: "PROGRAMMING",
      points: 5,
      orderIndex: 1,
      testCases: [
        {
          input: "3 5",
          expectedOutput: "8",
          isHidden: false,
          points: 1.5
        },
        {
          input: "10 -5",
          expectedOutput: "5", 
          isHidden: false,
          points: 1.5
        },
        {
          input: "0 0",
          expectedOutput: "0",
          isHidden: true,
          points: 1
        },
        {
          input: "-10 -20",
          expectedOutput: "-30",
          isHidden: true,
          points: 1
        }
      ],
      options: []
    },
    
    // Câu 2: Lập trình - Kiểm tra số chẵn lẻ
    {
      title: "Kiểm tra số chẵn lẻ",
      description: `Viết chương trình đọc vào một số nguyên n và kiểm tra xem n là số chẵn hay lẻ.

Yêu cầu:
- In ra "CHAN" nếu n là số chẵn
- In ra "LE" nếu n là số lẻ

Ví dụ:
Input: 4
Output: CHAN

Input: 7  
Output: LE`,
      questionType: "PROGRAMMING",
      points: 4,
      orderIndex: 2,
      testCases: [
        {
          input: "4",
          expectedOutput: "CHAN",
          isHidden: false,
          points: 1
        },
        {
          input: "7",
          expectedOutput: "LE",
          isHidden: false, 
          points: 1
        },
        {
          input: "0",
          expectedOutput: "CHAN",
          isHidden: true,
          points: 1
        },
        {
          input: "-3",
          expectedOutput: "LE",
          isHidden: true,
          points: 1
        }
      ],
      options: []
    },
    
    // Câu 3: Trắc nghiệm - Kiến thức lý thuyết
    {
      title: "Khái niệm về biến trong lập trình",
      description: `Trong lập trình, biến (variable) là gì?`,
      questionType: "MULTIPLE_CHOICE",
      points: 2,
      orderIndex: 3,
      testCases: [],
      options: [
        {
          optionText: "Là một giá trị không thể thay đổi trong chương trình",
          isCorrect: false,
          orderIndex: 1
        },
        {
          optionText: "Là vùng nhớ được đặt tên để lưu trữ dữ liệu có thể thay đổi",
          isCorrect: true,
          orderIndex: 2
        },
        {
          optionText: "Là một hàm được định nghĩa sẵn trong ngôn ngữ lập trình",
          isCorrect: false,
          orderIndex: 3
        },
        {
          optionText: "Là một loại dữ liệu nguyên thủy",
          isCorrect: false,
          orderIndex: 4
        }
      ]
    },
    
    // Câu 4: Trắc nghiệm - Nhiều đáp án đúng
    {
      title: "Các ngôn ngữ lập trình hướng đối tượng",
      description: `Những ngôn ngữ nào sau đây hỗ trợ lập trình hướng đối tượng? (Chọn tất cả đáp án đúng)`,
      questionType: "MULTIPLE_CHOICE", 
      points: 3,
      orderIndex: 4,
      testCases: [],
      options: [
        {
          optionText: "Java",
          isCorrect: true,
          orderIndex: 1
        },
        {
          optionText: "Python",
          isCorrect: true,
          orderIndex: 2
        },
        {
          optionText: "C",
          isCorrect: false,
          orderIndex: 3
        },
        {
          optionText: "C++",
          isCorrect: true,
          orderIndex: 4
        },
        {
          optionText: "JavaScript",
          isCorrect: true,
          orderIndex: 5
        }
      ]
    },
    
    // Câu 5: Đúng/Sai
    {
      title: "Độ phức tạp thuật toán",
      description: `Thuật toán sắp xếp nổi bọt (Bubble Sort) có độ phức tạp thời gian trung bình là O(n²).`,
      questionType: "TRUE_FALSE",
      points: 2,
      orderIndex: 5,
      testCases: [],
      options: [
        {
          optionText: "Đúng",
          isCorrect: true,
          orderIndex: 1
        },
        {
          optionText: "Sai", 
          isCorrect: false,
          orderIndex: 2
        }
      ]
    },
    
    // Câu 6: Tự luận
    {
      title: "Giải thích khái niệm đệ quy",
      description: `Hãy giải thích khái niệm đệ quy trong lập trình và cho một ví dụ cụ thể. 
      
Yêu cầu trả lời:
1. Định nghĩa đệ quy
2. Các thành phần cần có trong hàm đệ quy  
3. Ví dụ một hàm đệ quy đơn giản (có thể viết bằng pseudocode hoặc ngôn ngữ bất kỳ)
4. Ưu và nhược điểm của đệ quy

Độ dài tối thiểu: 200 từ`,
      questionType: "ESSAY",
      points: 4,
      orderIndex: 6,
      testCases: [],
      options: []
    }
  ]
};

// Tổng điểm: 5 + 4 + 2 + 3 + 2 + 4 = 20 điểm

export const sampleQuizAssignment = {
  title: "Quiz Nhanh - Kiến thức cơ bản Java",
  description: "Kiểm tra kiến thức nhanh về Java cơ bản",
  type: "QUIZ",
  courseId: 1,
  timeLimit: 15, // 15 phút
  allowLateSubmission: false,
  autoGrade: true,
  questions: [
    {
      title: "Từ khóa khai báo lớp",
      description: "Từ khóa nào được sử dụng để khai báo một lớp trong Java?",
      questionType: "MULTIPLE_CHOICE",
      points: 1,
      orderIndex: 1,
      testCases: [],
      options: [
        { optionText: "class", isCorrect: true, orderIndex: 1 },
        { optionText: "Class", isCorrect: false, orderIndex: 2 },
        { optionText: "object", isCorrect: false, orderIndex: 3 },
        { optionText: "new", isCorrect: false, orderIndex: 4 }
      ]
    },
    {
      title: "Java là ngôn ngữ biên dịch",
      description: "Java là ngôn ngữ lập trình được biên dịch trước khi chạy.",
      questionType: "TRUE_FALSE", 
      points: 1,
      orderIndex: 2,
      testCases: [],
      options: [
        { optionText: "Đúng", isCorrect: true, orderIndex: 1 },
        { optionText: "Sai", isCorrect: false, orderIndex: 2 }
      ]
    },
    {
      title: "Phương thức main",
      description: "Viết khai báo đúng cho phương thức main trong Java.",
      questionType: "ESSAY",
      points: 2,
      orderIndex: 3,
      testCases: [],
      options: []
    }
  ]
};

// Tổng điểm: 1 + 1 + 2 = 4 điểm
