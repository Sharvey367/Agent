export default function VolumeSlider({ label, value, onChange, icon }) {
  return (
    <div className="volume-slider">
      <label>
        <span className="volume-label">
          {icon && <span className="volume-icon">{icon}</span>}
          {label}
        </span>
        <span className="volume-value">{Math.round(value)}%</span>
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
