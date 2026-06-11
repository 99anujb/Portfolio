import { useEffect, useRef } from "react";
import "./styles/ScrollProgress.css";

const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (p !== last && barRef.current) {
        barRef.current.style.transform = `scaleX(${p})`;
        last = p;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />;
};

export default ScrollProgress;
