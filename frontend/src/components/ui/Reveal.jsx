import { useEffect, useRef, useState } from 'react';

export function Reveal({ children, className = '', as: Tag = 'div' }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  return <Tag ref={elementRef} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</Tag>;
}
