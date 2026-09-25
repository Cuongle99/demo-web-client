# Kế hoạch SEO: bóng gai tập tay phục hồi chức năng

URL: <https://demo-web-client.shop/products/bong-gai-tap-tay-phuc-hoi-chuc-nang>
Ngày kiểm tra: 25/09/2026

## Hiện trạng đã xác minh

- Trang trả HTTP 200; `robots.txt` cho phép thu thập; URL có trong sitemap 58 URL; canonical tự trỏ. HTML đầu tiên có title, meta description, một H1, ảnh có alt, `ProductGroup` với 3 variant và giá/tồn kho, cùng `BreadcrumbList`.
- Title hiện tại: “Bóng gai tập tay phục hồi chức năng bàn tay”. Description nói đúng công dụng hỗ trợ vận động, massage và sử dụng tại nhà. Mô tả Shopify đã có đặc điểm, hướng dẫn, thông số và FAQ. Vì vậy không thay title hoặc viết thêm văn bản lặp từ khóa trong code.
- Trước thay đổi, “Sản phẩm liên quan” lấy 10 hàng bán chạy đầu tiên; nhiều món không liên quan đến tập tay, như tã và đệm chống loét. Giá của cả ba phiên bản chỉ được thấy sau khi chọn từng nút.
- Không có quyền truy cập Google Search Console, dữ liệu thứ hạng, lượt hiển thị/nhấp, Merchant Center hay dữ liệu truy vấn thực. Kết quả tìm kiếm công khai không đủ để kết luận trang có/không được index.

## Thay đổi trong code

1. Chọn sản phẩm liên quan bằng các từ có nghĩa trong tên hàng; chỉ hiện sản phẩm có ít nhất hai từ chung và ưu tiên sản phẩm cùng collection. Điều này làm các liên kết sản phẩm từ trang đích sát chủ đề hơn.
2. Hiển thị giá ngay trên nút chọn phiên bản khi sản phẩm chỉ có một nhóm tùy chọn. Các giá lấy trực tiếp từ Shopify và vẫn theo trạng thái phiên bản hiện tại. Kích thước nút tối thiểu 44 px.
3. Giữ nguyên dữ liệu SEO/giá/availability hiện có, tránh tạo review, chứng nhận hoặc tuyên bố điều trị không được xác minh.

## Việc cần làm để cải thiện thứ hạng

| Ưu tiên | Việc làm | Cách nghiệm thu |
|---|---|---|
| Ngay sau khi triển khai | Trong Search Console, kiểm tra URL bằng URL Inspection, đối chiếu canonical Google chọn, lần crawl cuối và trạng thái index. Gửi lại sitemap nếu chưa có; chỉ dùng “Request indexing” sau khi trang đã cập nhật. | URL có thể được crawl/index; ghi lại nguyên nhân nếu chưa index. |
| Tuần 1 | Xác minh với nhà cung cấp chất liệu PU, mức lực 10LB/20LB áp cho phiên bản nào, kích thước, xuất xứ, bảo hành và SKU. Đưa thông số đã xác minh vào metafield Shopify để hiện bảng thông số. Rà soát cách dùng với người có chuyên môn phù hợp, nhất là trường hợp sau chấn thương/phẫu thuật. | Thông số khớp sản phẩm thực, ảnh và biến thể; không có lời hứa điều trị thiếu bằng chứng. |
| Tuần 1–2 | Chụp ảnh thật từng phiên bản và ảnh trong tay để thấy kích thước; bổ sung alt mô tả khác nhau. Nếu có thể, làm video ngắn thao tác và hướng dẫn chọn phiên bản. | Mỗi phiên bản có ảnh rõ; nội dung giúp khách chọn đúng loại. |
| Tuần 1–2 | Biên tập hai bài Shopify “7 dụng cụ hỗ trợ phục hồi chức năng...” và “Hướng dẫn lựa chọn dụng cụ phục hồi chức năng tại nhà”: chỉ thêm liên kết có ngữ cảnh tới sản phẩm khi đoạn viết thật sự nói về tập bàn tay/bóng tập. | Link là thẻ `<a href>` trong HTML, dẫn đúng URL canonical; không chèn link vô cớ. |
| Tuần 2–6 | Dùng báo cáo Performance trong Search Console, lọc theo URL. Xem truy vấn “bóng gai tập tay”, “bóng tập tay phục hồi chức năng”, “bóng gai tập cơ tay” và các truy vấn thực phát sinh. Điều chỉnh title/description trong Shopify khi thấy CTR thấp trên truy vấn phù hợp; giữ thông tin đúng với trang. | Có mốc gốc và số liệu theo tuần về impressions, clicks, CTR, vị trí trung bình; đối chiếu cùng kỳ và thiết bị. |
| Tuần 4–12 | Xem lại chất lượng liên kết từ bài hướng dẫn và danh mục, nội dung cạnh tranh, hiệu năng trên mobile và Core Web Vitals thực địa. Cập nhật nội dung theo câu hỏi thật của khách hàng; kiểm tra Search Console Product snippets/Merchant listings nếu có. | Tăng truy vấn phù hợp và lượt nhấp tự nhiên bền vững; không phát sinh lỗi index/schema. |

## Giới hạn và nguyên tắc đo lường

Không thể cam kết vị trí top Google từ thay đổi kỹ thuật đơn lẻ. Kết quả phụ thuộc cạnh tranh, chất lượng thông tin sản phẩm, uy tín website và thời gian Google thu thập lại. `site:` hoặc việc không thấy kết quả trong một lần tìm kiếm không phải phép thử index đáng tin; dùng URL Inspection của Search Console. Không thêm `FAQPage` hay đánh giá giả để cố lấy rich result. Giá, tồn kho và thông tin y tế phải trùng dữ liệu thật trên trang.

## Nguồn Google

- [Best practices for ecommerce sites](https://developers.google.com/search/docs/specialty/ecommerce)
- [Product variant structured data](https://developers.google.com/search/docs/appearance/structured-data/product-variants)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [How to use Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)
