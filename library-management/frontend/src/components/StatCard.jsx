import React from 'react';

export default function StatCard({ title, value, icon, subtitle, color = 'accent' }) {
  const colorMap = {
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger'
  };

  return (
    <div className="glass-card p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform cursor-default">
      <div className={`p-4 rounded-xl ${colorMap[color] || colorMap.accent}`}>
        {icon || (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      </div>
      <div>
        <h3 className="text-text-secondary text-sm font-medium">{title}</h3>
        <p className="text-3xl font-display font-bold mt-1 text-primary">{value}</p>
        {subtitle && <p className="text-xs text-text-secondary mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}
