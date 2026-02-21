import { useEffect, useRef, useCallback, useState } from 'react';
import { startPinkNoise, stopPinkNoise, setPinkNoiseVolume, fadePinkNoise } from '../audio/pinkNoise';
import { createYouTubePlayer } from '../audio/youtubePlayer';
import { useTimer, formatTime } from '../hooks/useTimer';
import VolumeSlider from './VolumeSlider';

export default function SessionPlayer({
  hypnosisVideoId,
  pinkNoiseSource,
  hypnosisVolume,
  pinkNoiseVolume,
  timerMinutes,
  fadeMinutes,
  onVolumeChange,
  onStop,
}) {
  const [blackScreen, setBlackScreen] = useState(false);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const hypnosisPlayerRef = useRef(null);
  const ambientPlayerRef = useRef(null);
  const hypnosisContainerRef = useRef('yt-hypnosis-' + Date.now());
  const ambientContainerRef = useRef('yt-ambient-' + Date.now());
  const fadeStartedRef = useRef(false);
  const elapsedRef = useRef(0);

  // Stop everything and clean up
  const cleanup = useCallback(() => {
    stopPinkNoise();
    if (hypnosisPlayerRef.current) {
      try { hypnosisPlayerRef.current.destroy(); } catch {}
      hypnosisPlayerRef.current = null;
    }
    if (ambientPlayerRef.current) {
      try { ambientPlayerRef.current.destroy(); } catch {}
      ambientPlayerRef.current = null;
    }
  }, []);

  const handleComplete = useCallback(() => {
    cleanup();
    onStop();
  }, [cleanup, onStop]);

  const handleTick = useCallback((remaining) => {
    elapsedRef.current += 1;
    setSessionElapsed(elapsedRef.current);

    // Handle hypnosis fade
    if (fadeMinutes > 0 && !fadeStartedRef.current) {
      const fadeAfterSeconds = fadeMinutes * 60;
      if (elapsedRef.current >= fadeAfterSeconds) {
        fadeStartedRef.current = true;
        // Fade hypnosis over 60 seconds
        if (hypnosisPlayerRef.current) {
          const steps = 20;
          const interval = 3000; // 3s per step = 60s total
          const currentVol = hypnosisPlayerRef.current.getVolume();
          let step = 0;
          const fadeInterval = setInterval(() => {
            step++;
            const vol = Math.max(0, currentVol * (1 - step / steps));
            if (hypnosisPlayerRef.current) {
              hypnosisPlayerRef.current.setVolume(vol);
            }
            if (step >= steps) {
              clearInterval(fadeInterval);
              if (hypnosisPlayerRef.current) {
                hypnosisPlayerRef.current.pauseVideo();
              }
            }
          }, interval);
        }
      }
    }
  }, [fadeMinutes]);

  const { remaining, isRunning, start, stop: stopTimer } = useTimer(handleTick, handleComplete);

  // Start session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      // Start pink noise (generated)
      if (pinkNoiseSource === 'generated') {
        startPinkNoise(pinkNoiseVolume / 100);
      }

      // Start ambient YouTube player if not generated
      if (pinkNoiseSource !== 'generated') {
        try {
          const player = await createYouTubePlayer(ambientContainerRef.current, pinkNoiseSource, {
            volume: pinkNoiseVolume,
            onReady: (e) => {
              if (mounted) e.target.playVideo();
            },
          });
          if (mounted) ambientPlayerRef.current = player;
        } catch {}
      }

      // Start hypnosis YouTube player
      if (hypnosisVideoId) {
        try {
          const player = await createYouTubePlayer(hypnosisContainerRef.current, hypnosisVideoId, {
            volume: hypnosisVolume,
            onReady: (e) => {
              if (mounted) e.target.playVideo();
            },
          });
          if (mounted) hypnosisPlayerRef.current = player;
        } catch {}
      }

      // Start timer
      if (mounted) {
        start(timerMinutes);
      }
    }

    initSession();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync hypnosis volume
  useEffect(() => {
    if (hypnosisPlayerRef.current) {
      try { hypnosisPlayerRef.current.setVolume(hypnosisVolume); } catch {}
    }
  }, [hypnosisVolume]);

  // Sync pink noise volume
  useEffect(() => {
    if (pinkNoiseSource === 'generated') {
      setPinkNoiseVolume(pinkNoiseVolume / 100);
    } else if (ambientPlayerRef.current) {
      try { ambientPlayerRef.current.setVolume(pinkNoiseVolume); } catch {}
    }
  }, [pinkNoiseVolume, pinkNoiseSource]);

  const handleStop = () => {
    stopTimer();
    cleanup();
    onStop();
  };

  if (blackScreen) {
    return (
      <div className="black-screen" onClick={() => setBlackScreen(false)}>
        <div className="black-screen-hint">Touchez pour revenir</div>
        {/* Hidden YouTube containers */}
        <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
          <div id={hypnosisContainerRef.current} />
          <div id={ambientContainerRef.current} />
        </div>
      </div>
    );
  }

  return (
    <div className="session-player">
      <div className="session-status">
        <div className="session-timer">
          {remaining !== null ? formatTime(remaining) : formatTime(sessionElapsed)}
        </div>
        <div className="session-label">
          {remaining !== null ? 'restant' : 'en cours'}
        </div>
      </div>

      <div className="session-controls">
        <VolumeSlider
          label="Hypnose"
          icon={'\u{1F319}'}
          value={hypnosisVolume}
          onChange={(v) => onVolumeChange('hypnosisVolume', v)}
        />
        <VolumeSlider
          label="Bruit de fond"
          icon={'\u{1F3B5}'}
          value={pinkNoiseVolume}
          onChange={(v) => onVolumeChange('pinkNoiseVolume', v)}
        />
      </div>

      <div className="session-actions">
        <button className="btn-black-screen" onClick={() => setBlackScreen(true)}>
          {'\uD83C\uDF11 \u00C9cran noir'}
        </button>
        <button className="btn-stop" onClick={handleStop}>
          {'Arr\u00EAter la s\u00E9ance'}
        </button>
      </div>

      {/* Hidden YouTube containers */}
      <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1, overflow: 'hidden' }}>
        <div id={hypnosisContainerRef.current} />
        <div id={ambientContainerRef.current} />
      </div>
    </div>
  );
}
