import { ambientSounds } from '../data/catalog';

export default function AmbientSelector({ source, onSelect }) {
  return (
    <div className="selector-section">
      <h3>Bruit de fond</h3>

      <div className="ambient-options">
        <button
          className={`ambient-option ${source === 'generated' ? 'selected' : ''}`}
          onClick={() => onSelect('generated')}
        >
          <span className="ambient-icon">{'\u{1F3B6}'}</span>
          <span className="ambient-label">Bruit rose (g\u00e9n\u00e9r\u00e9)</span>
          <span className="ambient-badge">Recommand\u00e9</span>
        </button>

        {ambientSounds.map((sound) => (
          <button
            key={sound.id}
            className={`ambient-option ${source === sound.id ? 'selected' : ''}`}
            onClick={() => onSelect(sound.id)}
          >
            <span className="ambient-icon">{sound.icon}</span>
            <span className="ambient-label">{sound.title}</span>
            <span className="ambient-duration">{sound.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
