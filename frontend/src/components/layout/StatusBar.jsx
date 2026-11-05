import { Icon } from '../ui/Icon';

export function StatusBar({ backendStatus, source }) {
  const backendLabel = backendStatus === 'checking' ? 'Checking' : backendStatus === 'available' ? 'Available' : 'Unavailable';
  const statusClass = backendStatus === 'available' ? 'status-dot live' : backendStatus === 'checking' ? 'status-dot checking' : 'status-dot offline';

  return (
    <aside className="status-panel" aria-label="System and privacy status">
      <div className="status-heading"><span className="eyebrow">System &amp; privacy status</span><Icon name="shield" size={18} /></div>
      <div className="status-grid">
        <span><i className="status-dot live" />Local password engine</span><strong>Available</strong>
        <span><i className={statusClass} />Backend education API</span><strong>{backendLabel}</strong>
        <span><i className={source === 'live' ? 'status-dot live' : 'status-dot offline'} />API content source</span><strong>{source === 'live' ? 'Live' : 'Local fallback'}</strong>
        <span><i className="status-dot live" />Password processing</span><strong>Local browser</strong>
        <span><i className="status-dot live" />Password persistence</span><strong>Disabled by design</strong>
      </div>
    </aside>
  );
}
