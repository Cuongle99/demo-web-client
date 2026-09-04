"use client";
import { useState, type FormEvent, type ReactNode } from "react";
export function SubmitForm({ endpoint, children, successMessage }: { endpoint: string; children: ReactNode; successMessage: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle"); const [message, setMessage] = useState("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setState("loading"); setMessage(""); const form = event.currentTarget; try { const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) }); const body = (await response.json()) as { message?: string }; if (!response.ok) throw new Error(body.message || "Không thể gửi yêu cầu."); setState("success"); setMessage(successMessage); form.reset(); } catch (error) { setState("error"); setMessage(error instanceof Error ? error.message : "Đã có lỗi xảy ra."); } }
  return <form className="form-card" action={endpoint} method="post" onSubmit={onSubmit}>{children}<button className="button button--primary" disabled={state === "loading"} type="submit">{state === "loading" ? "Đang gửi..." : "Gửi yêu cầu"}</button>{message && <p className={`form-status form-status--${state}`} role="status">{message}</p>}</form>;
}
