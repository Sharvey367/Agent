import { useState, useCallback } from 'react';

const STORAGE_KEY = 'somnomix-prefs';

const DEFAULTS = {
  hypnosisVideoId: null,
  hypnosisCustomUrl: '',
  hypnosisVolume: 60,
  pinkNoiseSource: 'generated', // 'generated' | ambient video id
  pinkNoiseVolume: 40,
  timerMinutes: 60,
  fadeMinutes: 30,
};

function loadPrefs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULTS, ...JSON.parse(stored) };
    }
  } catch {
    // corrupt storage
  }
  return { ...DEFAULTS };
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // storage full or unavailable
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState(loadPrefs);

  const updatePref = useCallback((key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      savePrefs(next);
      return next;
    });
  }, []);

  const updatePrefs = useCallback((updates) => {
    setPrefs((prev) => {
      const next = { ...prev, ...updates };
      savePrefs(next);
      return next;
    });
  }, []);

  return { prefs, updatePref, updatePrefs };
}
