import { useState } from 'react';
import { hypnosisVideos } from '../data/catalog';
import { extractVideoId } from '../audio/youtubePlayer';

export default function HypnosisSelector({ selectedId, customUrl, onSelect, onCustomUrl }) {
  const [showCustom, setShowCustom] = useState(false);
  const [inputUrl, setInputUrl] = useState(customUrl || '');

  const handleCustomSubmit = () => {
    const videoId = extractVideoId(inputUrl.trim());
    if (videoId) {
      onCustomUrl(inputUrl.trim(), videoId);
      setShowCustom(false);
    }
  };

  // Group videos by artist
  const grouped = {};
  for (const video of hypnosisVideos) {
    if (!grouped[video.artist]) grouped[video.artist] = [];
    grouped[video.artist].push(video);
  }

  return (
    <div className="selector-section">
      <h3>Hypnose guid\u00e9e</h3>

      <div className="video-list">
        {Object.entries(grouped).map(([artist, videos]) => (
          <div key={artist} className="artist-group">
            <div className="artist-name">{artist}</div>
            {videos.map((video) => (
              <button
                key={video.id}
                className={`video-option ${selectedId === video.id ? 'selected' : ''}`}
                onClick={() => onSelect(video.id)}
              >
                <span className="video-title">{video.title}</span>
                <span className="video-duration">{video.duration}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <button
        className={`custom-url-toggle ${showCustom ? 'active' : ''}`}
        onClick={() => setShowCustom(!showCustom)}
      >
        Lien YouTube personnalis\u00e9
      </button>

      {showCustom && (
        <div className="custom-url-input">
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
          />
          <button onClick={handleCustomSubmit} disabled={!extractVideoId(inputUrl.trim())}>
            OK
          </button>
        </div>
      )}
    </div>
  );
}
