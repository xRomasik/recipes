import { useEffect, useRef } from "react";

export const useDebounce = (
  callback: (args?: unknown) => unknown,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup the previous timeout on re-render
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function debouncedCallback(args?: unknown) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(args);
    }, delay);
  }

  return debouncedCallback;
};
