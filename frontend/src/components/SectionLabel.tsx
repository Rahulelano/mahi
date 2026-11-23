import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <span className="section-label">
      <span />
      {children}
    </span>
  );
}
