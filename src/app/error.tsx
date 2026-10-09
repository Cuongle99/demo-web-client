"use client";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <div className="inner-page container empty-state"><h1>Đã có lỗi xảy ra</h1><p>Không thể tải nội dung lúc này. Vui lòng thử lại.</p><button className="button button--primary" onClick={retry}>Thử lại</button></div>;
}
