"use client";

import { useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/lib/contact";
import { cn } from "@/lib/cn";

const control =
  "mt-1.5 w-full rounded-md border bg-raised px-3.5 py-2.5 text-fg transition-colors placeholder:text-muted/70 hover:border-fg/30";

export function ContactForm({ className }: { className?: string }) {
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("grid gap-5 sm:grid-cols-2", className)}>
      <Field id="contact-name" label="Name" error={errors.name}>
        <input
          id="contact-name"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name")}
          className={cn(control, errors.name ? "border-danger" : "border-line")}
        />
      </Field>

      <Field id="contact-email" label="Email" error={errors.email}>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
          className={cn(control, errors.email ? "border-danger" : "border-line")}
        />
      </Field>

      <Field id="contact-message" label="Message" error={errors.message} className="sm:col-span-2">
        <textarea
          id="contact-message"
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message")}
          className={cn(control, "resize-y", errors.message ? "border-danger" : "border-line")}
        />
      </Field>

      {/* Honeypot: hidden from people, filled in by bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={submitting} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: FieldError;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error?.message ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
