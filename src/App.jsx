import { useState, useCallback } from 'react';
import { usePreferences } from './hooks/usePreferences';
import StarryBackground from './components/StarryBackground';
import HypnosisSelector from './components/HypnosisSelector';
import AmbientSelector from './components/AmbientSelector';
import TimerSelector from './components/TimerSelector';
import VolumeSlider from './components/VolumeSlider';
import SessionPlayer from './components/SessionPlayer';

export default function App() {
  const { prefs, updatePref, updatePrefs } = usePreferences();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleHypnosisSelect = useCallback((videoId) => {
    updatePrefs({ hypnosisVideoId: videoId, hypnosisCustomUrl: '' });
  }, [updatePrefs]);

  const handleCustomUrl = useCallback((url, videoId) => {
    updatePrefs({ hypnosisVideoId: videoId, hypnosisCustomUrl: url });
  }, [updatePrefs]);

  const handleStart = () => {
    if (!prefs.hypnosisVideoId) return;
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleVolumeChange = useCallback((key, value) => {
    updatePref(key, value);
  }, [updatePref]);

  if (isPlaying) {
    return (
      <div className="app">
        <StarryBackground />
        <SessionPlayer
          hypnosisVideoId={prefs.hypnosisVideoId}
          pinkNoiseSource={prefs.pinkNoiseSource}
          hypnosisVolume={prefs.hypnosisVolume}
          pinkNoiseVolume={prefs.pinkNoiseVolume}
          timerMinutes={prefs.timerMinutes}
          fadeMinutes={prefs.fadeMinutes}
          onVolumeChange={handleVolumeChange}
          onStop={handleStop}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <StarryBackground />

      <div className="setup-screen">
        <header className="app-header">
          <h1>SomnoMix</h1>
          <p className="tagline">Hypnose guid\u00e9e &amp; bruit rose pour dormir</p>
        </header>

        <div className="setup-sections">
          <HypnosisSelector
            selectedId={prefs.hypnosisVideoId}
            customUrl={prefs.hypnosisCustomUrl}
            onSelect={handleHypnosisSelect}
            onCustomUrl={handleCustomUrl}
          />

          <AmbientSelector
            source={prefs.pinkNoiseSource}
            onSelect={(source) => updatePref('pinkNoiseSource', source)}
          />

          <div className="selector-section">
            <h3>Volumes</h3>
            <VolumeSlider
              label="Hypnose"
              icon={'\u{1F319}'}
              value={prefs.hypnosisVolume}
              onChange={(v) => updatePref('hypnosisVolume', v)}
            />
            <VolumeSlider
              label="Bruit de fond"
              icon={'\u{1F3B5}'}
              value={prefs.pinkNoiseVolume}
              onChange={(v) => updatePref('pinkNoiseVolume', v)}
            />
          </div>

          <TimerSelector
            timerMinutes={prefs.timerMinutes}
            fadeMinutes={prefs.fadeMinutes}
            onTimerChange={(v) => updatePref('timerMinutes', v)}
            onFadeChange={(v) => updatePref('fadeMinutes', v)}
          />
        </div>

        <button
          className="btn-start"
          onClick={handleStart}
          disabled={!prefs.hypnosisVideoId}
        >
          Commencer la s\u00e9ance
        </button>

        {!prefs.hypnosisVideoId && (
          <p className="hint">Choisissez une hypnose pour commencer</p>
        )}
      </div>
    </div>
  );
}
