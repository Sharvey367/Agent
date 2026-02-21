import { TIMER_OPTIONS, FADE_OPTIONS } from '../data/catalog';

export default function TimerSelector({
  timerMinutes,
  fadeMinutes,
  onTimerChange,
  onFadeChange,
}) {
  return (
    <div className="selector-section">
      <h3>Minuterie</h3>

      <div className="timer-group">
        <label className="timer-label">Arr\u00eat automatique</label>
        <div className="timer-pills">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`pill ${timerMinutes === opt.value ? 'selected' : ''}`}
              onClick={() => onTimerChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="timer-group">
        <label className="timer-label">Fondu de l&apos;hypnose apr\u00e8s</label>
        <div className="timer-pills">
          {FADE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`pill ${fadeMinutes === opt.value ? 'selected' : ''}`}
              onClick={() => onFadeChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
