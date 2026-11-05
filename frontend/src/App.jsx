import { useEffect, useMemo, useState } from 'react';
import { PasswordAnalyzer } from './components/analyzer/PasswordAnalyzer';
import { ScoreDashboard } from './components/dashboard/ScoreDashboard';
import { EducationHub } from './components/education/EducationHub';
import { PasswordGenerator } from './components/generator/PasswordGenerator';
import { Icon } from './components/ui/Icon';
import { Reveal } from './components/ui/Reveal';
import { fallbackThreats, fallbackTips } from './data/fallbackEducation';
import { analyzePassword } from './security/passwordEngine';
import { getEducationBundle } from './services/publicApi';

function App() {
  const [password, setPassword] = useState('');
  const [education, setEducation] = useState({ tips: fallbackTips, threats: fallbackThreats, source: 'local-fallback' });
  const [splash, setSplash] = useState(true);
  const analysis = useMemo(() => analyzePassword(password), [password]);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;
    getEducationBundle().then((bundle) => {
      if (active) setEducation({ tips: bundle.tips.data, threats: bundle.threats.data, source: bundle.source });
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="app-shell">
      {splash && (
        <div className="splash-overlay" aria-hidden="true">
          <div className="splash-core">
            <img className="splash-logo" src="/keyverdict-lockup.png" alt="" />
            <span className="splash-glow" />
          </div>
        </div>
      )}
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KeyVerdict home"><img className="brand-logo" src="/keyverdict-lockup.png" alt="KeyVerdict logo" /></a>
        <nav className="main-nav" aria-label="Main navigation"><a href="#analyzer">Analyzer</a><a href="#generator">Generator</a><a href="#learn">Learn</a></nav>
        <a className="header-privacy" href="#privacy"><Icon name="lock" size={14} /> Privacy first</a>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy"><div className="hero-kicker"><span className="kicker-line" /> Private password intelligence</div><h1>Guard your access.<br /><span>Before the breach.</span></h1><p className="hero-lede">Analyze any test password privately, generate stronger secrets, and understand how modern attacks unfold — entirely in your browser. Nothing leaves your device.</p><div className="hero-actions"><a className="button primary" href="#analyzer">Launch local analysis <Icon name="arrow" size={17} /></a><a className="button ghost" href="#learn">Learn best practices</a></div><div className="hero-proof"><span><Icon name="shield" size={16} /> No credential telemetry</span><span><Icon name="zap" size={16} /> Web Crypto generation</span></div></div>
          <div className="hero-visual" aria-label="Three-dimensional local security engine visualization"><div className="hud-corner hud-corner-top">LOCAL ENGINE <b>● READY</b></div><div className="hud-corner hud-corner-bottom">BROWSER <b>ENCRYPTED</b></div><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-orbit orbit-three" /><div className="visual-core"><div className="core-face core-face-front"><Icon name="lock" size={40} /><span>LOCAL<br /><b>ENGINE</b></span></div><div className="core-face core-face-back"><Icon name="shield" size={32} /><span>PRIVATE<br /><b>PROCESSING</b></span></div></div><div className="visual-node node-one"><i />Password<br /><b>ANALYZER</b></div><div className="visual-node node-two"><i />No network<br /><b>REQUIRED</b></div><div className="visual-node node-three"><i />Web Crypto<br /><b>GENERATOR</b></div></div>
        </section>

        <Reveal className="reveal-workspace"><div className="workspace-grid"><div><PasswordAnalyzer password={password} analysis={analysis} onChange={setPassword} /><ScoreDashboard analysis={analysis} /></div><PasswordGenerator onUse={setPassword} /></div></Reveal>
        <Reveal className="reveal-slide-right"><EducationHub tips={education.tips} threats={education.threats} source={education.source} /></Reveal>

        <Reveal className="reveal-slide-left"><section className="privacy-banner" id="privacy"><div className="privacy-icon"><Icon name="lock" size={22} /></div><div><span className="eyebrow">Your privacy promise</span><h2>Your secret never becomes telemetry.</h2><p>There is no password endpoint. The education API only serves public guidance, and the analyzer remains fully usable if the network disappears.</p></div><span className="privacy-seal"><Icon name="check" size={15} /> Client-side only</span></section></Reveal>
      </main>

      <footer className="site-footer"><div className="brand footer-brand"><img className="brand-logo" src="/keyverdict-lockup.png" alt="KeyVerdict logo" /></div><span>Defensive by design — built for better habits</span></footer>
    </div>
  );
}

export default App;
