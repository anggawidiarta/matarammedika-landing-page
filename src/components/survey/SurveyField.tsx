import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { fieldClass } from "./formUi";

export function SurveyField({
  label,
  htmlFor,
  className = "",
  error,
  errorId,
  children,
}: {
  label: string;
  htmlFor?: string;
  className?: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 min-w-0 ${className}`}>
      <label className="flex flex-col gap-2 min-w-0" htmlFor={htmlFor}>
        <span
          className={`text-sm font-medium font-body ${
            error ? "text-promo" : "text-heading"
          }`}
        >
          {label}
        </span>
        {children}
      </label>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm font-body text-promo"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SurveyTextInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClass} ${className}`} {...props} />;
}

export function SurveyTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`resize-y ${fieldClass} min-h-32 ${className}`}
      {...props}
    />
  );
}
