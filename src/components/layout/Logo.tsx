import Image from "next/image";
import Link from "next/link";
export function Logo({ inverse = false }: { inverse?: boolean }) { return <Link href="/" className={`logo ${inverse ? "logo--inverse" : ""}`} aria-label="Toàn Tâm Medical - Trang chủ"><Image src={inverse ? "/assets/logo-footer.png" : "/assets/logo-header.png"} alt="Toàn Tâm Medical" width={inverse ? 155 : 150} height={inverse ? 56 : 45} priority={!inverse} /></Link>; }
