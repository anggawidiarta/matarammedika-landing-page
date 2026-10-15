import { useEffect, useRef, type RefObject } from "react";

/** While `open`, close on outside pointer-down (`onOutside`) and on Escape (`onEscape`). */
export function useDismiss(
  containerRef: RefObject<HTMLElement | null>,
  open: boolean,
  onOutside: () => void,
  onEscape: () => void,
) {
  const handlers = useRef({ onOutside, onEscape });
  handlers.current = { onOutside, onEscape };

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) handlers.current.onOutside();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      handlers.current.onEscape();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, containerRef]);
}
