import { useEffect, useRef } from "react";

export default function Syllabuses({ pages }: { pages: string[] }) {
  const containerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerEl.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!entries || !Array.isArray(entries) || entries.length === 0) return;
        entries.forEach((entry) => {
          const sw = entry.target.scrollWidth;
          const cw = entry.contentRect.width;
          const target = entry.target as HTMLElement;
          target.style.transform = `scale(${cw / sw})`;
          target.style.height = `${target.scrollHeight * (cw / sw)}px`;
        });
      });
    });
    Array.from(container.children).forEach((child) =>
      resizeObserver.observe(child),
    );

    return () => {
      resizeObserver.disconnect();
    };
  }, [pages]);

  return (
    <div ref={containerEl}>
      {pages.map((page, i) => (
        <div
          key={i}
          className="relative origin-top-left"
          dangerouslySetInnerHTML={{ __html: page }}
        />
      ))}
    </div>
  );
}
