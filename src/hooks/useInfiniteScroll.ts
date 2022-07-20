import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  totalPages: number;
  options?: IntersectionObserverInit;
}

export default function ({ totalPages, options }: UseInfiniteScrollProps) {
  const [stop, setStop] = useState(false);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;

      if (target.isIntersecting && !stop) {
        setPage((prev) => ++prev);
      }
    },
    [stop],
  );

  useEffect(() => {
    if (totalPages <= page && totalPages !== 0) {
      setStop(true);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      handleObserver,
      options || {
        root: null,
        threshold: 1.0,
      },
    );

    observer.observe(containerRef.current);

    return () => {
      if (!containerRef.current) {
        return;
      }
      observer.unobserve(containerRef.current);
    };
  }, [containerRef, handleObserver]);

  return {
    page,
    containerRef,
  };
}
