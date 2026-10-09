export const policies = [
  {
    slug: "purchasing", title: "Hướng dẫn mua hàng",
    description: "Hướng dẫn chọn thiết bị y tế và yêu cầu báo giá tại Toàn Tâm. Giá, giao hàng, thanh toán, bảo hành và đổi trả được xác nhận trước khi đặt mua.",
    intro: "Toàn Tâm tiếp nhận nhu cầu mua thiết bị y tế và xác nhận các điều khoản trong báo giá hoặc xác nhận đơn trước khi khách hàng đặt mua.",
    sections: [
      { title: "Chọn sản phẩm và gửi nhu cầu", paragraphs: ["Xem thông tin sản phẩm, chọn mẫu hoặc kích thước phù hợp và cho biết số lượng cần mua. Nếu cần tư vấn, liên hệ Toàn Tâm hoặc gửi yêu cầu báo giá trên website."] },
      { title: "Kiểm tra báo giá trước khi đặt mua", paragraphs: ["Báo giá hoặc xác nhận đơn là nơi xác nhận sản phẩm, số lượng, giá, khu vực giao hàng, phí và thời gian dự kiến, phương thức thanh toán, thời hạn và điều kiện bảo hành, đổi trả, cùng các chi phí phát sinh.", "Khách hàng cần kiểm tra các nội dung này và đề nghị làm rõ những thông tin còn thiếu trước khi đặt mua."] },
      { title: "Xác nhận nhu cầu đặt hàng", paragraphs: ["Sau khi thống nhất báo giá, khách hàng xác nhận sản phẩm và thông tin liên hệ, nhận hàng với Toàn Tâm. Nếu nhu cầu thay đổi, hãy liên hệ để xác nhận lại các điều khoản áp dụng."] },
    ],
  },
  {
    slug: "payment", title: "Chính sách thanh toán", label: "Thanh toán",
    description: "Phương thức, số tiền, thời điểm thanh toán và chi phí phát sinh khi mua thiết bị y tế Toàn Tâm được xác nhận trong báo giá trước khi đặt mua.",
    intro: "Phương thức thanh toán được thỏa thuận trong báo giá hoặc xác nhận đơn trước khi khách hàng đặt mua.",
    sections: [
      { title: "Nội dung cần xác nhận", paragraphs: ["Khách hàng và Toàn Tâm xác nhận phương thức, số tiền, thời điểm thanh toán và các chi phí phát sinh trong báo giá hoặc xác nhận đơn. Điều khoản áp dụng phụ thuộc vào đơn hàng đã thống nhất."] },
      { title: "Kiểm tra thông tin thanh toán", paragraphs: ["Trước khi thanh toán, đối chiếu sản phẩm, số lượng, giá và thông tin nhận thanh toán với báo giá đã xác nhận. Nếu có thông tin chưa rõ hoặc khác với báo giá, liên hệ Toàn Tâm để kiểm tra."] },
      { title: "Hỗ trợ đối chiếu", paragraphs: ["Lưu báo giá, xác nhận đơn và chứng từ thanh toán để thuận tiện đối chiếu. Khi cần hỗ trợ, cung cấp thông tin đơn hàng và nội dung cần kiểm tra qua đầu mối liên hệ bên dưới."] },
    ],
  },
  {
    slug: "shipping", title: "Chính sách vận chuyển", label: "Vận chuyển",
    description: "Khu vực giao hàng, phí vận chuyển và thời gian giao dự kiến của Toàn Tâm được xác nhận theo địa điểm và đơn hàng trong báo giá trước khi đặt mua.",
    intro: "Khu vực giao hàng, phí vận chuyển và thời gian dự kiến được xác nhận trong báo giá hoặc xác nhận đơn trước khi đặt mua.",
    sections: [
      { title: "Địa điểm, chi phí và thời gian", paragraphs: ["Cung cấp địa chỉ nhận hàng và số lượng sản phẩm để Toàn Tâm xác nhận khả năng giao hàng, phí, thời gian dự kiến và các chi phí phát sinh. Khách hàng kiểm tra những nội dung này trong báo giá trước khi đặt mua."] },
      { title: "Thay đổi thông tin nhận hàng", paragraphs: ["Nếu cần thay đổi địa chỉ hoặc thông tin người nhận, liên hệ Toàn Tâm để kiểm tra phương án giao hàng và xác nhận lại chi phí, thời gian dự kiến theo tình trạng đơn hàng."] },
      { title: "Tiếp nhận vấn đề khi giao hàng", paragraphs: ["Khi nhận thấy hàng giao có vấn đề hoặc cần kiểm tra tiến độ, liên hệ Toàn Tâm và cung cấp thông tin đơn hàng, mô tả vấn đề, hình ảnh nếu có. Việc xử lý được đối chiếu với điều khoản đã xác nhận cho đơn hàng."] },
    ],
  },
  {
    slug: "warranty", title: "Chính sách bảo hành", label: "Bảo hành",
    description: "Thời hạn, phạm vi, điều kiện bảo hành và chi phí liên quan đến từng thiết bị y tế Toàn Tâm được xác nhận trong báo giá trước khi khách hàng đặt mua.",
    intro: "Thời hạn và điều kiện bảo hành được xác nhận theo sản phẩm trong báo giá hoặc xác nhận đơn trước khi đặt mua.",
    sections: [
      { title: "Điều khoản theo từng sản phẩm", paragraphs: ["Khách hàng cần kiểm tra thời hạn, phạm vi, điều kiện bảo hành và các chi phí phát sinh trong báo giá hoặc xác nhận đơn của sản phẩm dự định mua. Không áp dụng một thời hạn chung cho mọi sản phẩm trên website."] },
      { title: "Gửi yêu cầu hỗ trợ", paragraphs: ["Liên hệ Toàn Tâm, cung cấp tên hoặc mã sản phẩm, thông tin đơn hàng và mô tả vấn đề. Có thể gửi hình ảnh và chứng từ liên quan nếu có để thuận tiện kiểm tra."] },
      { title: "Xác nhận phương án tiếp nhận", paragraphs: ["Toàn Tâm tiếp nhận thông tin và đối chiếu với điều kiện đã xác nhận cho sản phẩm. Liên hệ trước khi gửi hàng để được hướng dẫn đầu mối, địa điểm tiếp nhận và xác nhận các chi phí liên quan."] },
    ],
  },
  {
    slug: "returns", title: "Chính sách đổi trả và hoàn tiền", label: "Đổi trả và hoàn tiền",
    description: "Điều kiện, thời hạn đổi trả, chi phí phát sinh và phương án hoàn tiền khi mua tại Toàn Tâm được xác nhận trong báo giá trước khi đặt mua.",
    intro: "Điều kiện, thời hạn đổi trả và chi phí phát sinh được xác nhận trong báo giá hoặc xác nhận đơn trước khi khách hàng đặt mua.",
    sections: [
      { title: "Kiểm tra điều khoản trước khi mua", paragraphs: ["Khách hàng cần xác nhận trường hợp được tiếp nhận đổi trả, thời hạn, tình trạng sản phẩm cần đáp ứng, trách nhiệm chi trả các chi phí và phương án hoàn tiền nếu áp dụng. Những nội dung này được ghi trong báo giá hoặc xác nhận đơn trước khi đặt mua."] },
      { title: "Gửi yêu cầu đổi trả", paragraphs: ["Liên hệ Toàn Tâm với thông tin đơn hàng, sản phẩm và lý do đề nghị đổi trả. Gửi hình ảnh hoặc chứng từ liên quan nếu có để thuận tiện đối chiếu với điều khoản đã thống nhất."] },
      { title: "Xác nhận tiếp nhận và hoàn tiền", paragraphs: ["Liên hệ trước khi gửi hàng để xác nhận điều kiện tiếp nhận, địa chỉ nhận hàng và chi phí liên quan. Phương thức, số tiền và thời gian hoàn tiền nếu áp dụng được xác nhận theo điều khoản của đơn hàng và kết quả xử lý yêu cầu."] },
    ],
  },
] as const;

export function getPolicy(slug: string) {
  return policies.find((policy) => policy.slug === slug);
}
