import Image from "next/image";
import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className={`logo ${inverse ? "logo--inverse" : ""}`} aria-label="Toàn Tâm Medical - Trang chủ">
      <Image src="/assets/logo-toan-tam.png" alt="Toàn Tâm Medical" width={180} height={60} priority={!inverse} />
    </Link>
  );
}
