# Shuff

## Bật tìm địa điểm miễn phí với Geoapify

1. Đăng ký tại [Geoapify MyProjects](https://myprojects.geoapify.com/) và tạo một project.
2. Sao chép API key trong mục **API Keys**.
3. Tạo file `.env.local` ở thư mục gốc của dự án:

```env
GEOAPIFY_API_KEY=thay_bang_api_key_cua_ban
```

4. Khởi động lại ứng dụng bằng `npm run dev`.

API key chỉ được đọc trong Route Handler phía server, không được gửi xuống trình duyệt. Kết quả trực tiếp được cache 30 phút để tiết kiệm quota miễn phí. Khi chưa có key hoặc Geoapify tạm thời không phản hồi, ứng dụng tự chuyển sang bộ gợi ý địa phương trong `src/data/places.ts`.

Dữ liệu địa điểm được cung cấp bởi Geoapify và OpenStreetMap. Người dùng có thể mở từng kết quả trên Google Maps để xem đánh giá và giờ mở cửa.
