import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = { children: ReactNode; className?: string; variant?: "primary" | "outline" | "light" };
type LinkProps = CommonProps & { href: string; type?: never };
type NativeProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

export function Button(props: LinkProps | NativeProps) {
  const className = `button button--${props.variant ?? "primary"} ${props.className ?? ""}`;
  if ("href" in props && props.href) return <Link href={props.href} className={className}>{props.children}</Link>;
  const native = props as NativeProps;
  return <button className={className} type={native.type} disabled={native.disabled} name={native.name} value={native.value} onClick={native.onClick}>{native.children}</button>;
}
