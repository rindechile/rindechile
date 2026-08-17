import { useEffect, useState, useRef, RefObject } from 'react';

export function useResponsiveDimensions(containerRef: RefObject<HTMLDivElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (containerRef.current) {
          const width = containerRef.current.clientWidth;
          const height = window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 350 : 300;
          setDimensions(prev =>
            prev.width === width && prev.height === height ? prev : { width, height }
          );
        }
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(containerRef.current);

    // Window resize needed for height breakpoints (based on window.innerWidth)
    window.addEventListener('resize', updateDimensions, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [containerRef]);

  return dimensions;
}
