import { useState, useEffect } from 'react';

export default function InsightPanel({ insight }) {
  const [visible, setVisible] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      setKey((k) => k + 1);
      setVisible(true);
    }, 80);
    return () => clearTimeout(timer);
  }, [insight]);

  return (
    <div
      style={{
        padding: '14px 24px',
        background: '#111',
        borderTop: '1px solid #222',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        key={key}
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.35s ease',
          color: '#ddd',
          fontSize: '15px',
          lineHeight: 1.5,
        }}
      >
        💡 {insight || ''}
      </span>
    </div>
  );
}
