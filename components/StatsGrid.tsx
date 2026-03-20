export function StatsGrid({ items }: { items: Array<{ label: string; value: string; helper?: string }> }) {
  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div key={item.label} className="stat-card card">
          <span className="muted">{item.label}</span>
          <strong>{item.value}</strong>
          {item.helper ? <small className="muted">{item.helper}</small> : null}
        </div>
      ))}
    </div>
  );
}
