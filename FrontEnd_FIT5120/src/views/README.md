# Views Folder Structure

Thư mục `views` đã được tổ chức lại theo chức năng để dễ quản lý và phát triển.

## Cấu trúc thư mục

```
views/
├── auth/                           # Xác thực người dùng
│   └── PassCode.vue               # Trang nhập mã truy cập
├── home/                          # Trang chủ và thông tin
│   ├── HomeView.vue               # Trang chủ chính
│   └── AboutView.vue              # Trang giới thiệu
├── learning/                      # Các tính năng học tập
│   ├── english/                   # Học tiếng Anh
│   │   ├── LearnEnglish.vue       # Trang học tiếng Anh chính
│   │   └── FlashcardsView.vue     # Trang flashcards
│   └── social-norms/             # Chuẩn mực xã hội
│       ├── socialNorms.vue        # Trang chuẩn mực xã hội chính
│       ├── MeetingPeople.vue      # Gặp gỡ mọi người
│       ├── EatingOut.vue          # Ăn uống bên ngoài
│       ├── socialNorms_backup.vue # File backup
│       └── socialNorms_broken.vue # File backup (bị lỗi)
├── navigate-life/                 # Điều hướng cuộc sống
│   ├── NavigateYourLife.vue       # Trang điều hướng chính
│   ├── transportation/            # Giao thông công cộng
│   │   ├── PublicTransportation.vue  # Giao thông công cộng chung
│   │   ├── MykiCardLearning.vue      # Học về thẻ Myki
│   │   ├── BusLearning.vue           # Học về xe buýt
│   │   ├── TrainLearning.vue         # Học về tàu điện
│   │   └── TramLearning.vue          # Học về tram
│   ├── daily-life/               # Cuộc sống hàng ngày
│   │   ├── Grocceries Shopping.vue   # Mua sắm tạp hóa
│   │   └── MedicalAttention.vue      # Chăm sóc y tế
│   └── safety/                   # An toàn
│       └── SafetyPage.vue         # Trang an toàn
├── facilities/                    # Cơ sở vật chất và sự kiện
│   ├── FacilityEvent.vue          # Trang cơ sở và sự kiện
│   ├── FacilityDetailPage.vue     # Chi tiết cơ sở
│   └── EventDetailPage.vue        # Chi tiết sự kiện
├── interactive/                   # Tương tác
│   ├── QuizTaking.vue             # Làm quiz
│   └── ChatbotView.vue            # Chatbot
└── dev/                          # Development/Test
    └── testView.vue               # Trang test

```

## Lợi ích của cấu trúc mới

### 1. **Phân chia rõ ràng theo chức năng**

- Mỗi thư mục đại diện cho một nhóm chức năng cụ thể
- Dễ dàng tìm kiếm và định vị file theo chức năng

### 2. **Dễ mở rộng**

- Thêm view mới vào đúng thư mục chức năng
- Tạo thư mục con mới khi cần thiết

### 3. **Bảo trì tốt hơn**

- Các file liên quan được nhóm lại với nhau
- Giảm thiểu xung đột khi nhiều developer làm việc

### 4. **Import paths rõ ràng**

- Đường dẫn import phản ánh cấu trúc logic
- Dễ hiểu mục đích của từng component

## Quy tắc đặt tên và tổ chức

### Thư mục

- Sử dụng kebab-case cho tên thư mục
- Tên thư mục phản ánh chức năng chính

### File Vue

- Giữ nguyên PascalCase như Vue convention
- Tên file mô tả rõ chức năng

### Import trong Router

- Cập nhật đường dẫn import theo cấu trúc mới
- Sử dụng dynamic import để tối ưu performance

## Migration Notes

Tất cả đường dẫn import trong router đã được cập nhật để phản ánh cấu trúc mới. Các file Vue components không cần thay đổi nội dung, chỉ vị trí lưu trữ.

### Các thay đổi chính:

1. Di chuyển file từ `views/` gốc vào các thư mục con
2. Cập nhật import paths trong `router/index.js`
3. Giữ nguyên tên file và nội dung components
