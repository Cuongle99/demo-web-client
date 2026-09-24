# Triển khai sau SEO audit — 23/09/2026

Website: <https://demo-web-client.shop/>. Mã đã đẩy lên `main` và Vercel đã phục vụ bản mới. Shopify store: `ad-homedecor.myshopify.com`.

## Nơi chỉnh sửa trong Shopify

- **40 sản phẩm, 7 collection và 5 bài blog:** Page title và Meta description nằm trong **Search engine listing** của từng mục. Các giá trị được chuyển từ SEO Page sang trường SEO gốc của Shopify. Trang web đã được xác nhận đọc các trường này; thử sửa title/description của một sản phẩm và thấy nội dung mới trên site.
- **7 collection:** đoạn giới thiệu được chuyển vào Description của chính collection.
- **5 bài blog:** nguồn tham khảo và liên kết nội bộ nằm trong metafield được ghim ở từng bài; trường người rà soát và ngày rà soát đã được chuẩn bị nhưng để trống cho tới khi có người được xác minh.
- **40 sản phẩm:** metafield được ghim cho thông số kỹ thuật và nguồn tham khảo; giá và tồn kho tiếp tục lấy từ Product/Variant.
- **6 trang tĩnh:** SEO Page Metaobjects còn lại cho trang chủ, danh sách sản phẩm, danh sách collection, danh sách blog, liên hệ và yêu cầu báo giá. 52 mục SEO Page chi tiết tạm thời do đợt triển khai trước tạo đã được dọn sau khi dữ liệu chuyển sang mục gốc; Shopify còn đúng 6 mục SEO Page Active.

Hướng dẫn nhập liệu: [shopify-seo-metaobjects.md](shopify-seo-metaobjects.md).

## Kết quả xác minh công khai

| Hạng mục | Kết quả sau triển khai |
|---|---|
| Sitemap | 58 URL, đã bỏ `/search`; 58/58 URL trả HTTP 200 |
| Metadata | 58/58 có description và đúng một H1; không có description trùng nguyên văn trong sitemap; canonical của 58 URL tự trỏ |
| Trang phân trang | `/products?page=2,3,4` và collection trang 2 có canonical riêng; trang ngoài phạm vi trả 404 |
| URL lọc/tìm kiếm | `noindex,follow`; `/search` canonical về chính `/search` |
| URL không tồn tại | Product, collection, blog detail và URL tĩnh đều trả HTTP 404 |
| Structured data | 40/40 sản phẩm có `Offer` từ giá variant hiển thị; 5 bài có `BlogPosting`, nguồn tham khảo và liên kết nội bộ; các trang chi tiết có `BreadcrumbList` |
| Open Graph và ảnh | 58/58 URL có ảnh chia sẻ; 92/92 URL ảnh được thử trả thành công |

Bảng chi tiết 58 URL sitemap và 17 URL thử: [seo-url-verification-2026-09-23.csv](seo-url-verification-2026-09-23.csv). Đây là kiểm tra HTML và HTTP công khai, không phải trạng thái index trong Google.

## Nội dung cần biên tập tiếp

- Các tuyên bố điều trị/giảm đau trong mô tả sản phẩm nguồn Shopify cần đối chiếu tài liệu nhà sản xuất hoặc người có chuyên môn. Không tự tạo chứng nhận, đánh giá hay kết quả lâm sàng.
- Metafield thông số kỹ thuật sản phẩm để trống tới khi có dữ liệu kiểm chứng. Trường người rà soát bài viết cũng để trống cho tới khi có danh tính và vai trò thực.
- SEO title và description đã có cho toàn bộ mục, nhưng những tên sản phẩm dài cần được biên tập riêng để phù hợp bản xem trước trong Shopify. Không có giới hạn ký tự cố định từ Google; trình biên tập Shopify sẽ hiển thị gợi ý độ dài.
- Không có dữ liệu Search Console hoặc Core Web Vitals thực địa; các thay đổi SEO cần được theo dõi sau khi Google crawl lại.

## Lighthouse sau triển khai

Lighthouse 13.4.0 trên Headless Chrome 153, ba lượt cho mỗi mẫu trang và thiết bị; bảng là trung vị của ba lượt trong môi trường thử nghiệm. Cả 36 báo cáo JSON đều hoàn chỉnh, không có `runtimeError`. Một số lệnh CLI báo lỗi dọn dẹp Chrome tạm sau khi lưu báo cáo, nên số đo được lấy từ JSON đã ghi.

| Mẫu trang | Thiết bị | Performance | SEO | LCP | CLS |
|---|---|---:|---:|---:|---:|
| Trang chủ | Mobile | 85 | 100 | 3.74 s | 0 |
| Trang chủ | Desktop | 100 | 100 | 0.70 s | 0 |
| Danh sách sản phẩm | Mobile | 97 | 100 | 2.47 s | 0 |
| Danh sách sản phẩm | Desktop | 100 | 100 | 0.66 s | 0 |
| Chi tiết sản phẩm | Mobile | 93 | 100 | 2.93 s | 0 |
| Chi tiết sản phẩm | Desktop | 100 | 100 | 0.64 s | 0 |
| Collection | Mobile | 97 | 100 | 2.59 s | 0 |
| Collection | Desktop | 100 | 100 | 0.65 s | 0 |
| Danh sách blog | Mobile | 92 | 100 | 3.21 s | 0 |
| Danh sách blog | Desktop | 100 | 100 | 0.63 s | 0 |
| Chi tiết blog | Mobile | 95 | 100 | 2.89 s | 0 |
| Chi tiết blog | Desktop | 100 | 100 | 0.56 s | 0 |

Không lượt nào có CLS > 0.1, so với 9/36 lượt trong audit ban đầu. LCP mobile còn trên 2.5 giây ở 5/6 mẫu, cao nhất là trang chủ 3.74 giây. Đây là việc tối ưu hiệu năng còn mở; kết quả Lighthouse không phản ánh Core Web Vitals thực địa. Phần nội dung y tế cần rà soát chuyên môn như nêu trên.

## Cập nhật 24/09/2026

Đối chiếu lại 40 sản phẩm trong Shopify với HTML của trang chi tiết: các Page title đã cấu hình và Meta description đều khớp sau khi loại bỏ hậu tố tự thêm vào title và việc cắt ngắn description. Một sản phẩm nẹp bàn chân chưa có Page title riêng đã được điền vào trường Search engine listing, nên hiện 40/40 sản phẩm có title và description cấu hình trong Shopify. Sitemap được làm mới theo chu kỳ 5 phút để phản ánh handle sửa trong Shopify; hai URL sản phẩm cũ phát hiện trong sitemap được chuyển hướng vĩnh viễn tới URL mới.
