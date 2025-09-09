# Tính năng Tạo Bài Tập Đa Câu Hỏi cho Giáo Viên

## Tổng Quan

Tính năng này cho phép Giáo viên tạo bài tập phức tạp với nhiều câu hỏi khác nhau, mỗi câu hỏi có thể có test cases riêng và điểm số tùy chỉnh. Hệ thống hỗ trợ 4 loại câu hỏi chính:

1. **Lập trình (PROGRAMMING)** - Có test cases để kiểm tra code
2. **Trắc nghiệm (MULTIPLE_CHOICE)** - Nhiều lựa chọn với đáp án đúng
3. **Tự luận (ESSAY)** - Câu hỏi mở 
4. **Đúng/Sai (TRUE_FALSE)** - Câu hỏi Yes/No

## Cách Sử Dụng

### Bước 1: Truy cập Trang Giáo viên
- Đăng nhập với tài khoản Giáo viên
- Vào trang Dashboard của Giáo viên tại `/teacher`

### Bước 2: Mở Form Tạo Bài Tập
Có 3 cách để mở form tạo bài tập:
1. Nhấn nút "Tạo bài tập" trong **Thao tác nhanh**
2. Vào tab **Quản lý bài tập** và nhấn nút "Tạo bài tập mới"
3. Nếu chưa có bài tập nào, nhấn "Tạo bài tập đầu tiên"

### Bước 3: Điền Thông Tin Cơ Bản
**Thông tin bắt buộc:**
- **Tiêu đề bài tập**: Tên bài tập
- **Khóa học**: Chọn khóa học từ danh sách khóa học bạn giảng dạy

**Thông tin tùy chọn:**
- **Mô tả bài tập**: Mô tả chi tiết về bài tập
- **Loại bài tập**: Bài tập, Bài thi, Dự án, hoặc Quiz
- **Thời gian làm bài**: Thời gian giới hạn (phút)
- **Thời gian bắt đầu/kết thúc**: Lịch trình bài tập
- **Cho phép nộp trễ**: Có/Không
- **Tự động chấm điểm**: Có/Không

### Bước 4: Thêm Câu Hỏi

#### 4.1 Thêm Câu Hỏi Mới
- Nhấn nút **"+ Thêm câu hỏi"** trong sidebar
- Câu hỏi mới sẽ xuất hiện trong danh sách
- Nhấn vào câu hỏi để chỉnh sửa

#### 4.2 Cấu Hình Câu Hỏi
Mỗi câu hỏi có các thông tin:
- **Tiêu đề câu hỏi**: Tên câu hỏi
- **Mô tả câu hỏi**: Nội dung chi tiết, yêu cầu
- **Loại câu hỏi**: Chọn một trong 4 loại
- **Điểm số**: Điểm tối đa cho câu hỏi này

### Bước 5: Cấu Hình Theo Loại Câu Hỏi

#### A. Câu Hỏi Lập Trình
**Thêm Test Cases:**
1. Nhấn **"+ Thêm Test Case"**
2. Điền thông tin:
   - **Input**: Dữ liệu đầu vào
   - **Expected Output**: Kết quả mong đợi
   - **Test case ẩn**: Có/Không (sinh viên có thấy không)
   - **Điểm**: Điểm cho test case này

**Ví dụ Test Case:**
```
Input: 5 3
Expected Output: 8
Điểm: 2.5
```

#### B. Câu Hỏi Trắc Nghiệm
**Thêm Lựa Chọn:**
1. Nhấn **"+ Thêm lựa chọn"**
2. Nhập nội dung lựa chọn
3. Đánh dấu ✓ cho đáp án đúng
4. Có thể có nhiều đáp án đúng

#### C. Câu Hỏi Đúng/Sai
- Tự động tạo 2 lựa chọn: "Đúng" và "Sai"
- Chọn đáp án đúng bằng radio button

#### D. Câu Hỏi Tự Luận
- Không cần cấu hình thêm
- Sinh viên sẽ nhập câu trả lời dạng text

### Bước 6: Hoàn Tất
- **Kiểm tra tổng điểm**: Hệ thống tự động tính tổng điểm từ tất cả câu hỏi
- Nhấn **"Tạo bài tập"** để lưu
- Bài tập sẽ xuất hiện trong danh sách quản lý

## Tính Năng Nâng Cao

### Quản Lý Bài Tập
Tại tab **Quản lý bài tập**, bạn có thể:
- **Xem chi tiết**: Xem thông tin đầy đủ của bài tập
- **Bật/Tắt**: Kích hoạt/vô hiệu hóa bài tập
- **Xóa**: Xóa bài tập (có xác nhận)
- **Lọc theo khóa học**: Xem bài tập của khóa học cụ thể

### Thống Kê
Mỗi bài tập hiển thị:
- Số lượng câu hỏi
- Tổng điểm
- Số bài nộp
- Số bài chờ chấm
- Thời gian tạo/cập nhật

### Xem Chi Tiết Bài Tập
Modal chi tiết hiển thị:
- **Thông tin cơ bản**: Loại, điểm, thời gian, trạng thái
- **Mô tả đầy đủ** của bài tập
- **Danh sách câu hỏi** với từng loại và điểm
- **Test cases** cho câu hỏi lập trình
- **Lựa chọn** cho câu hỏi trắc nghiệm
- **Thống kê** bài nộp và chấm điểm

## Kinh Nghiệm Sử Dụng

### Thiết Kế Bài Tập Hiệu Quả

1. **Bắt đầu với câu dễ**: Câu đầu nên đơn giản để sinh viên làm quen
2. **Phân chia điểm hợp lý**: 
   - Câu dễ: 1-3 điểm
   - Câu trung bình: 3-5 điểm  
   - Câu khó: 5-10 điểm

3. **Test cases đa dạng**:
   - Test case công khai: Để sinh viên hiểu yêu cầu
   - Test case ẩn: Để kiểm tra tính đúng đắn
   - Edge cases: Các trường hợp biên

4. **Mô tả rõ ràng**: Viết mô tả câu hỏi chi tiết, có ví dụ

### Ví Dụ Bài Tập Hoàn Chỉnh

**Tiêu đề**: Bài tập Lập trình Cơ bản - Tuần 3

**Câu 1** (5 điểm): Tính tổng 2 số
- Loại: Lập trình
- Test case 1: Input "3 5" → Output "8" (2.5 điểm)
- Test case 2: Input "10 -5" → Output "5" (2.5 điểm)

**Câu 2** (3 điểm): Kiến thức lý thuyết
- Loại: Trắc nghiệm
- Lựa chọn A, B, C, D với đáp án B đúng

**Câu 3** (2 điểm): Đánh giá thuật toán
- Loại: Đúng/Sai
- "Thuật toán sắp xếp nổi bọt có độ phức tạp O(n²)" → Đúng

**Tổng**: 10 điểm

## Lưu Ý Kỹ Thuật

- Bài tập được tạo sẽ tự động có trạng thái "Hoạt động"
- Điểm tổng được tính tự động từ tổng điểm các câu hỏi
- Test cases ẩn không hiển thị với sinh viên
- Có thể chỉnh sửa bài tập sau khi tạo (tính năng sẽ được bổ sung)

## Giao Diện Sinh Viên

Khi sinh viên làm bài, họ sẽ thấy:
- **Danh sách câu hỏi** với loại và điểm từng câu
- **Test cases công khai** cho câu lập trình
- **Lựa chọn** cho câu trắc nghiệm/đúng sai
- **Ô nhập text** cho câu tự luận
- **Thời gian còn lại** và trạng thái làm bài

Tính năng này tạo ra một hệ thống bài tập linh hoạt và mạnh mẽ, cho phép Giáo viên tạo các bài kiểm tra phong phú và toàn diện cho sinh viên.
