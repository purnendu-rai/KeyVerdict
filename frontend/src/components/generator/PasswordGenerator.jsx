import { useState } from 'react';
import { analyzePassword, copyToClipboard, generatePassword } from '../../security/passwordEngine';
import { Icon } from '../ui/Icon';

const CHAR_OPTIONS = [
  { key: 'lowercase',        label: 'a b c' },
  { key: 'uppercase',        label: 'A B C' },
  { key: 'numbers',          label: '1 2 3' },
  { key: 'symbols',          label: '! @ #' },
  { key: 'excludeAmbiguous', label: 'no l/I/O/0', inverted: true },
];

export function PasswordGenerator({ onUse }) {
  const [generated, setGenerated] = useState('');
  const [length, setLength] = useState(20);
  const [strength, setStrength] = useState('strong');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [opts, setOpts] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });

  function toggleOpt(key) {
    setOpts((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function createPassword() {
    try {
      const next = generatePassword(length, opts);
      setGenerated(next);
      setStrength(analyzePassword(next).label);
      setCopied(false);
      setError('');
    } catch (generationError) {
      setError(generationError.message);
    }
  }

  async function handleCopy() {
    const didCopy = await copyToClipboard(generated);
    setCopied(didCopy);
  }

  return (
    <section className="panel generator-panel" id="generator" aria-labelledby="generator-title">
      <div className="panel-topline"><span className="eyebrow">Secure generator</span><span className="private-chip teal"><Icon name="zap" size={13} /> Web Crypto entropy</span></div>
      <div className="section-heading compact-heading"><div><h2 id="generator-title">Generate a new key</h2><p>Create a unique secret without sending it anywhere.</p></div><button type="button" className="icon-button gen-refresh-btn" onClick={createPassword} aria-label="Regenerate password"><Icon name="refresh" size={23} /></button></div>
      <div className="generator-output" aria-live="polite"><span>{generated || 'Click generate to create a private password'}</span>{generated && <button type="button" className="icon-button" onClick={handleCopy} aria-label="Copy generated password"><Icon name="copy" size={18} /></button>}</div>
      {generated && <div className="generator-strength"><Icon name="shield" size={13} /> Generated strength: <strong>{strength}</strong></div>}
      <div className="generator-controls">
        <label htmlFor="length">Length <strong>{length}</strong></label>
        <input id="length" type="range" min="12" max="32" value={length} onChange={(event) => setLength(Number(event.target.value))} />

        {/* Character-set option checkboxes */}
        <div className="generator-char-opts" role="group" aria-label="Character set options">
          {CHAR_OPTIONS.map(({ key, label }) => {
            const checked = opts[key];
            return (
              <label key={key} className={`char-opt${checked ? ' char-opt--on' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOpt(key)}
                  aria-label={label}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>

        <button className="button primary" type="button" onClick={createPassword}><Icon name="zap" size={17} /> Generate</button>
      </div>
      {generated && <div className="generator-actions"><button type="button" className="text-button" onClick={() => onUse(generated)}>Use in analyzer <Icon name="arrow" size={15} /></button><span>{copied ? 'Copied locally — clear your clipboard when finished.' : 'Clipboard access is optional.'}</span></div>}
      {error && <p className="error-note">{error}</p>}
    </section>
  );
}
