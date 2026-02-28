import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section
      className={`w-full px-6 py-14 ${className}`}
      style={{ maxWidth: '100%' }}
    >
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </section>
  );
}
