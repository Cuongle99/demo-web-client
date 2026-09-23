# Chỉnh sửa nội dung SEO trong Shopify

Website đọc dữ liệu từ store `ad-homedecor.myshopify.com`. Trong Shopify Admin, vào **Content → Metaobjects → SEO Page** để mở 58 mục đã tạo. Mỗi mục tương ứng một URL hiện có: trang chủ, trang tĩnh, 7 danh mục, 40 sản phẩm và 5 bài viết. Các mục đang ở trạng thái **Active** và có quyền đọc trên Storefront.

| Trường trong SEO Page | Nơi hiển thị |
|---|---|
| Page name | Tên để tìm mục trong Shopify Admin |
| Page path | Khóa ghép với URL, ví dụ `/products` hoặc `/collections/thể-thao-ngoai-trời` |
| SEO title | Thẻ `<title>` và tiêu đề chia sẻ |
| Meta description | Thẻ description và nội dung chia sẻ |
| Page heading (H1) | Tiêu đề chính trong trang |
| Intro text | Đoạn giới thiệu trên trang chủ, danh sách, danh mục, chi tiết sản phẩm hoặc bài viết |
| Social image | Ảnh Open Graph khi chia sẻ URL |
| Medical reviewer, Reviewer role, Review date | Thông tin người rà soát nội dung trên bài viết, chỉ điền sau khi xác minh |
| References | Nguồn tham khảo dưới bài viết hoặc chi tiết sản phẩm; mỗi dòng `Tên nguồn|https://example.com` |
| Related links | Liên kết nội bộ dưới bài viết; mỗi dòng `Tên liên kết|/products/...` |
| Technical specs | Bảng thông số trên chi tiết sản phẩm; mỗi dòng `Tên thông số|Giá trị` |

## Quy trình chỉnh sửa

1. Tìm mục theo **Page name**, mở và sửa nội dung. Giữ nguyên **Page path** và handle của mục: website dùng chúng để khớp dữ liệu với URL.
2. Nếu điền ảnh chia sẻ, chọn ảnh đã tải lên Shopify Files. Lưu mục và giữ trạng thái **Active**.
3. Mở URL tương ứng để kiểm tra tiêu đề, đoạn giới thiệu, liên kết và nguồn. Website làm mới dữ liệu Shopify theo chu kỳ khoảng 5 phút; trang tĩnh có thể được tạo lại sau lần truy cập tiếp theo.
4. Khi thêm trang mới, cần tạo mục SEO Page mới với đúng path và handle `seo-` + 20 ký tự đầu của SHA-256 cho path đã giải mã và chuẩn Unicode NFC. Quy tắc này được thực hiện trong `src/lib/shopify/seo-content.ts`; có thể nhờ người phụ trách kỹ thuật tạo mục mới để tránh sai khóa.

**Dữ liệu gốc:** tên, giá, ảnh, tồn kho, mô tả dài và biến thể sản phẩm vẫn sửa trong **Products** của Shopify; bài viết dài vẫn sửa trong **Online Store → Blog posts**. SEO Page quản lý phần trình bày bổ sung và metadata. Thông số kỹ thuật chỉ nên điền từ tài liệu đã xác minh. Không thêm tên người duyệt, chứng nhận, hiệu quả điều trị hoặc đánh giá khi chưa có bằng chứng.

**Lưu ý:** mục SEO Page chỉ sửa nội dung cho URL đã tồn tại; việc tạo mục không tự tạo sản phẩm, danh mục hoặc bài viết mới trên website. URL lọc/tìm kiếm được đặt `noindex`, còn trang phân trang sạch tự canonical.
