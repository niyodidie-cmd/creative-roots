import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className = '', id }: SectionProps) {
  return (
    <section
      id={id}
      className={`w-full px-5 py-[60px] ${className}`}
      style={{ maxWidth: '100%' }}
    >
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </section>
  );
}
