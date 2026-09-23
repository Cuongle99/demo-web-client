# Chỉnh sửa SEO và nội dung trong Shopify

Store: `ad-homedecor.myshopify.com`. Website lấy thông tin SEO từ chính các mục Shopify; dữ liệu được làm mới theo chu kỳ khoảng 5 phút.

## Sản phẩm, collection và bài blog

Mở mục tương ứng trong [Products](https://admin.shopify.com/store/ad-homedecor/products), [Collections](https://admin.shopify.com/store/ad-homedecor/collections) hoặc [Blog posts](https://admin.shopify.com/store/ad-homedecor/content/articles?selectedView=all). Tại cuối trang, mở **Search engine listing → Edit** để sửa **Page title** và **Meta description**, rồi lưu mục. Đây là nguồn dữ liệu cho `<title>`, meta description và Open Graph trên website.

| Loại mục | Trường nội dung khác có thể sửa ngay trong mục |
|---|---|
| Sản phẩm | Title là H1; Description là mô tả dài; Media là ảnh chia sẻ mặc định. **Product metafields** được ghim: Thông số kỹ thuật, Nguồn tham khảo sản phẩm. |
| Collection | Title là H1; Description là đoạn giới thiệu; Image là ảnh chia sẻ mặc định. |
| Bài blog | Title là H1; Summary là đoạn tóm tắt đầu bài; Body là nội dung chính; Image là ảnh chia sẻ mặc định. **Article metafields** được ghim: Nguồn tham khảo SEO, Liên kết liên quan SEO, Người rà soát y khoa, Vai trò người rà soát, Ngày rà soát. |

Các trường **Nguồn tham khảo** dùng mỗi dòng `Tên nguồn|https://example.com`; **Liên kết liên quan** dùng `Tên liên kết|/products/...` hoặc đường dẫn nội bộ khác; **Thông số kỹ thuật** dùng `Tên thông số|Giá trị`. Chỉ điền dữ liệu sản phẩm và thông tin chuyên môn đã kiểm chứng. Không thêm tên người duyệt, chứng nhận, hiệu quả điều trị hoặc đánh giá khi chưa có bằng chứng.

## Trang tĩnh

Trang chủ, danh sách sản phẩm, danh sách collection, danh sách blog, liên hệ và yêu cầu báo giá dùng [Content → Metaobjects → SEO Page](https://admin.shopify.com/store/ad-homedecor/content/metaobjects/entries/seo_page). Sáu mục này quản lý SEO title, meta description, H1, đoạn giới thiệu và ảnh chia sẻ của các trang không có trình biên tập riêng trong Shopify.

Trong SEO Page, giữ nguyên **Page path** và **Handle** để website khớp dữ liệu với URL. Khi sửa, giữ trạng thái **Active**, lưu mục và mở URL tương ứng để kiểm tra. Việc tạo SEO Page không tự tạo URL mới trên website.

URL lọc/tìm kiếm có `noindex`; trang phân trang không lọc tự canonical. Giá, tồn kho và thông tin sản phẩm vẫn lấy trực tiếp từ Shopify Products.
