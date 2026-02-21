// YouTube IFrame API manager
// Manages loading the API and creating hidden players for audio-only playback

let apiReady = false;
let apiLoadPromise = null;

function loadYouTubeAPI() {
  if (apiReady) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      apiReady = true;
      resolve();
      return;
    }

    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      apiReady = true;
      if (existingCallback) existingCallback();
      resolve();
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

  return apiLoadPromise;
}

export function extractVideoId(urlOrId) {
  if (!urlOrId) return null;
  // Already a video ID (11 chars, no slashes/dots)
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;

  try {
    const url = new URL(urlOrId);
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1);
    }
    if (url.hostname.includes('youtube.com')) {
      return url.searchParams.get('v');
    }
  } catch {
    // Not a URL
  }
  return null;
}

export async function createYouTubePlayer(containerId, videoId, options = {}) {
  await loadYouTubeAPI();

  const { volume = 50, onReady, onStateChange, onError } = options;

  return new Promise((resolve) => {
    const player = new window.YT.Player(containerId, {
      videoId,
      height: '1',
      width: '1',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event) => {
          event.target.setVolume(volume);
          if (onReady) onReady(event);
          resolve(player);
        },
        onStateChange: onStateChange || (() => {}),
        onError: onError || (() => {}),
      },
    });
  });
}
