"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/lib/contact";
import { cn } from "@/lib/cn";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  async function onSubmit(values: ContactInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Try again.");
        return;
      }
      toast.success("Message sent. I'll reply within 24 hours.");
      reset();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono text-sm" noValidate>
      <div>
        <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-terminal-muted">
          <span className="text-terminal-prompt">$</span> name
        </label>
        <input
          id="contact-name"
          autoComplete="name"
          {...register("name")}
          className={cn(
            "mt-1 w-full rounded-md border bg-terminal-bg px-3 py-2 text-terminal-fg outline-none transition-colors focus:border-terminal-prompt",
            errors.name ? "border-terminal-keyword" : "border-terminal-border"
          )}
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-terminal-keyword">{errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-terminal-muted">
          <span className="text-terminal-prompt">$</span> email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className={cn(
            "mt-1 w-full rounded-md border bg-terminal-bg px-3 py-2 text-terminal-fg outline-none transition-colors focus:border-terminal-prompt",
            errors.email ? "border-terminal-keyword" : "border-terminal-border"
          )}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-terminal-keyword">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-terminal-muted">
          <span className="text-terminal-prompt">$</span> message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          {...register("message")}
          className={cn(
            "mt-1 w-full resize-y rounded-md border bg-terminal-bg px-3 py-2 text-terminal-fg outline-none transition-colors focus:border-terminal-prompt",
            errors.message ? "border-terminal-keyword" : "border-terminal-border"
          )}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-terminal-keyword">{errors.message.message}</p>
        ) : null}
      </div>

      {/* Honeypot — hidden from real users */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-md border border-terminal-border bg-terminal-surface px-4 py-2 text-terminal-fg transition-colors hover:border-terminal-prompt disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-terminal-prompt">$</span>
        {submitting ? "sending..." : "./send"}
      </button>
    </form>
  );
}
