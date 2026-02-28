import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section
      className={`w-full px-5 py-[60px] ${className}`}
      style={{ maxWidth: '100%' }}
    >
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </section>
  );
}
