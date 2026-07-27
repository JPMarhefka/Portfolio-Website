"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "@/app/partuno/partuno.module.css";
import { Button } from "@/components/ui/Button";
import { submitPartunoWaitlist } from "./submitPartunoWaitlist";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const statusMessages: Record<SubmissionStatus, string> = {
  idle: "",
  submitting: "Submitting your email...",
  success: "You're on the list.",
  error: "Something went wrong. Please try again.",
};

export function PartunoWaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      await submitPartunoWaitlist(email);
      setEmail("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit}>
      <div className={styles.formHeading}>
        <label className={styles.formLabel} htmlFor="partuno-email">
          Get early access
        </label>
        <span>Product updates only. No spam.</span>
      </div>
      <div className={styles.formRow}>
        <input
          className={styles.emailInput}
          id="partuno-email"
          name="email"
          type="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
            if (status === "error" || status === "success") {
              setStatus("idle");
            }
          }}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={isSubmitting}
        />
        <Button
          className={styles.submitButton}
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Joining..." : "Join the Waitlist"}
        </Button>
      </div>
      <p
        className={`${styles.formStatus} ${status === "error" ? styles.formStatusError : ""}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMessages[status]}
      </p>
    </form>
  );
}
