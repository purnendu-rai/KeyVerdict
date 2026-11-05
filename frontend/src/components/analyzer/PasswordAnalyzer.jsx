import { useId, useState } from 'react';
import { Icon } from '../ui/Icon';

const checkLabels = [
  ['length', '12+ character foundation'],
  ['longLength', '16+ character depth'],
  ['lowercase', 'Lowercase characters'],
  ['uppercase', 'Uppercase characters'],
  ['number', 'Numbers included'],
  ['symbol', 'Symbols included'],
  ['unique', 'Character variety'],
  ['common', 'Not on breach lists'],
  ['sequence', 'No predictable runs'],
  ['repeated', 'No repeated characters'],
  ['keyboard', 'No keyboard patterns'],
  ['dictionary', 'No dictionary words'],
  ['date', 'No dates / personal info'],
];

// These checks are "met" when their value is FALSE (they flag a weakness).
const invertedChecks = new Set(['common', 'sequence', 'repeated', 'keyboard', 'dictionary', 'date']);

export function PasswordAnalyzer({ password, analysis, onChange }) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();
  const scoreWidth = `${Math.max(analysis.percentage, 4)}%`;

  return (
    <section className="panel analyzer-panel" id="analyzer" aria-labelledby="analyzer-title">
      <div className="panel-topline"><span className="eyebrow">Password analysis</span><span className="private-chip"><Icon name="lock" size={13} /> No network input path</span></div>
      <div className="section-heading compact-heading">
        <div><h2 id="analyzer-title">Threat-model your password</h2><p>See how an attacker might view a password — privately, in your browser.</p></div>
        <div className={`strength-badge ${analysis.tone}`}><span className="badge-pulse" />{analysis.label}</div>
      </div>

      <div className="password-field-wrap">
        <label htmlFor={inputId}>Enter a synthetic password</label>
        <div className="password-field">
          <Icon name="lock" size={19} />
          <input id={inputId} type={visible ? 'text' : 'password'} value={password} onChange={(event) => onChange(event.target.value)} placeholder="Type a test value — never a real credential" autoComplete="new-password" spellCheck="false" aria-describedby={`${inputId}-privacy`} />
          <button type="button" className="icon-button" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Hide password' : 'Show password'}>{<Icon name={visible ? 'eyeOff' : 'eye'} size={19} />}</button>
        </div>
        <p className="field-note" id={`${inputId}-privacy`}><Icon name="shield" size={13} /> Local computation only. Use a synthetic marker, never a real credential.</p>
      </div>

      <div className="analysis-grid">
        <div className="score-ring" style={{ '--ring-progress': `${analysis.percentage}%`, '--ring-color': `var(--${analysis.tone}-color)` }}>
          <div className="score-inner"><strong>{analysis.score}<small>/4</small></strong><span>security score</span></div>
        </div>
        <div className="analysis-details">
          <div className="metric-row"><span>Estimated offline guess time</span><strong>{analysis.guessTime}</strong></div>
          <div className="metric-row"><span>Estimated entropy</span><strong>{analysis.entropy} bits</strong></div>
          <div className="meter-track" aria-label={`Password quality ${analysis.percentage}%`}><span style={{ width: scoreWidth }} /></div>
          <p className="analysis-feedback">{analysis.feedback}</p>
        </div>
      </div>

      <div className="requirements" aria-label="Password requirements">
        {checkLabels.map(([key, label]) => {
          const raw = analysis.checks[key];
          const met = invertedChecks.has(key) ? !raw : raw;
          return <div className={met ? 'requirement met' : 'requirement'} key={key}><span>{met ? '✓' : '○'}</span>{label}</div>;
        })}
      </div>
    </section>
  );
}
