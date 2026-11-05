import { Icon } from '../ui/Icon';

export function ScoreDashboard({ analysis }) {
  const insights = [
    { label: 'Length', value: `${analysis.checks.longLength ? 'Deep' : analysis.checks.length ? 'Solid' : 'Short'}`, icon: 'lock' },
    { label: 'Variety', value: `${analysis.checks.unique ? 'High' : 'Limited'}`, icon: 'zap' },
    { label: 'Patterns', value: `${analysis.checks.sequence || analysis.checks.repeated ? 'Detected' : 'Clear'}`, icon: 'shield' },
  ];

  return (
    <section className="dashboard-section" aria-labelledby="insights-title">
      <div className="section-heading"><div><span className="eyebrow">Strength insights</span><h2 id="insights-title">Read the attack surface</h2></div><span className="section-number">LOCAL ENGINE // 03</span></div>
      <div className="insights-grid">{insights.map((insight) => <article className="insight-card" key={insight.label}><span className="insight-icon"><Icon name={insight.icon} size={19} /></span><span>{insight.label}</span><strong>{insight.value}</strong><div className="mini-bars"><i /><i className={insight.value === 'Limited' || insight.value === 'Detected' || insight.value === 'Short' ? '' : 'active'} /><i className={insight.value === 'High' || insight.value === 'Clear' || insight.value === 'Deep' ? 'active' : ''} /></div></article>)}</div>
    </section>
  );
}
