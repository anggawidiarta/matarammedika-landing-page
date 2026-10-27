import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="border-heading/8 flex flex-col items-center gap-2 border-t px-6 py-8 text-center">
      <span
        aria-hidden
        className="bg-surface-tint text-blue mb-1 inline-flex size-12 items-center justify-center rounded-xl"
      >
        <Inbox size={22} strokeWidth={1.75} />
      </span>
      <p className="text-base font-semibold text-balance">{title}</p>
      {description && (
        <p className="text-heading/80 max-w-prose text-sm leading-6 text-pretty">{description}</p>
      )}
      {action}
    </div>
  );
}
