import { Icon } from '../ui/Icon';

export function EducationHub({ tips, threats, source }) {
  return (
    <section className="education-section" id="learn" aria-labelledby="learn-title">
      <div className="section-heading"><div><span className="eyebrow">Security education</span><h2 id="learn-title">Build the human firewall</h2><p>Small habits create durable defenses. Decode the signals behind modern attacks.</p></div><span className="source-label"><i className={source === 'live' ? 'status-dot live' : 'status-dot offline'} />{source === 'live' ? 'Live education feed' : 'Bundled education'}</span></div>
      <div className="education-grid">
        <div className="tips-column"><div className="column-title"><Icon name="shield" size={17} /><span>Defensive guidance</span></div>{tips.slice(0, 4).map((tip, index) => <article className="tip-card" key={tip.id}><span className="card-index">0{index + 1}</span><div><span className="card-category">{tip.category}</span><h3>{tip.title}</h3><p>{tip.description}</p><strong><Icon name="check" size={14} /> {tip.practice}</strong></div></article>)}</div>
        <div className="threats-column"><div className="column-title"><Icon name="zap" size={17} /><span>Know the signal</span></div><div className="threat-list">{threats.map((threat) => <article className="threat-item" key={threat.id}><div className="threat-title"><span className="threat-dot" /><h3>{threat.name}</h3><Icon name="arrow" size={15} /></div><p>{threat.description}</p><span className="defense-line">Defense: {threat.defense}</span></article>)}</div></div>
      </div>
    </section>
  );
}
