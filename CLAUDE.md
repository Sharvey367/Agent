# CLAUDE.md

This file provides guidance for AI assistants working with the **SomnoMix** repository.

## Repository Overview

**SomnoMix** is a sleep-focused web app that combines guided hypnosis (via YouTube audio) with scientifically-based pink noise generation. Built with Vite + React, it targets mobile-first usage (phone in bed). The UI is dark/night-themed with a starry sky animation.

## Project Structure

```
Agent/
├── CLAUDE.md                          # AI assistant guidance (this file)
├── index.html                         # HTML entry point
├── package.json                       # Dependencies and scripts
├── vite.config.js                     # Vite configuration
├── src/
│   ├── main.jsx                       # React DOM entry point
│   ├── index.css                      # Global styles (dark theme, responsive)
│   ├── App.jsx                        # Root component — setup screen / session routing
│   ├── audio/
│   │   ├── pinkNoise.js               # Web Audio API pink noise generator
│   │   └── youtubePlayer.js           # YouTube IFrame API manager (audio-only)
│   ├── components/
│   │   ├── AmbientSelector.jsx        # Pink noise source picker (generated vs YouTube)
│   │   ├── HypnosisSelector.jsx       # Hypnosis video picker + custom URL input
│   │   ├── SessionPlayer.jsx          # Active session: playback, timer, fade, black screen
│   │   ├── StarryBackground.jsx       # Animated starry sky canvas
│   │   ├── TimerSelector.jsx          # Sleep timer + fade timer pill selectors
│   │   └── VolumeSlider.jsx           # Reusable volume slider control
│   ├── data/
│   │   └── catalog.js                 # Curated video catalog + timer/fade options
│   └── hooks/
│       ├── usePreferences.js          # localStorage-backed user preferences
│       └── useTimer.js                # Countdown/elapsed timer logic
└── public/                            # Static assets
```

## Build & Run

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite HMR)
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run lint         # ESLint
```

## Architecture

### Audio System (two independent sources)

1. **Pink noise** (`src/audio/pinkNoise.js`): Web Audio API `ScriptProcessorNode` using Paul Kellet's pink noise algorithm. Infinite, no loop boundary. This is the recommended default. Alternatively, the user can pick a YouTube ambient sound (rain, ocean, etc.).

2. **Hypnosis** (`src/audio/youtubePlayer.js`): YouTube IFrame API loading videos in hidden 1x1 iframes for audio-only playback. No API key required. The user selects from a curated list of French hypnosis channels or pastes a custom YouTube URL.

Both sources play simultaneously with independent volume controls.

### Key Behaviors

- **Smart fade**: After a configurable delay, the hypnosis audio fades out over 60 seconds while pink noise continues
- **Sleep timer**: Auto-stops the entire session after a configurable duration
- **Black screen mode**: Pure black fullscreen to save battery and avoid lighting the room
- **Preference persistence**: All settings (selected video, volumes, timer, fade) saved in localStorage under key `somnomix-prefs`

### Component Flow

```
App (setup vs playing state)
├── Setup mode:
│   ├── HypnosisSelector → pick video or paste URL
│   ├── AmbientSelector → generated pink noise or YouTube ambient
│   ├── VolumeSlider ×2 → independent hypnosis/noise volumes
│   ├── TimerSelector → sleep timer + fade timer
│   └── Start button
└── Playing mode:
    └── SessionPlayer → timer display, live volume, black screen, stop
```

## Code Conventions

- **Language**: French for all user-facing text, English for code/comments
- **Styling**: Single global CSS file (`index.css`) using CSS custom properties
- **Unicode in JSX**: Never use `\u{...}` escapes as bare JSX text — always wrap in `{'...'}` string expressions. Standard 4-digit `\uXXXX` escapes in JS strings are fine.
- **Audio cleanup**: Always disconnect AudioContext nodes and destroy YouTube players in useEffect cleanup functions
- **No external UI library**: Pure React + vanilla CSS, no component framework

## Key Files

| File | Purpose |
|------|---------|
| `src/data/catalog.js` | All curated YouTube video IDs, timer options, fade options |
| `src/audio/pinkNoise.js` | Start/stop/volume/fade controls for generated pink noise |
| `src/audio/youtubePlayer.js` | YouTube IFrame API loader + player factory |
| `src/hooks/usePreferences.js` | Read/write user preferences from localStorage |
| `src/hooks/useTimer.js` | Countdown timer with tick/complete callbacks |
| `src/components/SessionPlayer.jsx` | Core playback session — orchestrates both audio sources |

## Adding New Hypnosis Videos

Add entries to the `hypnosisVideos` array in `src/data/catalog.js`:
```js
{ id: 'YOUTUBE_VIDEO_ID', title: 'Title', artist: 'Channel Name', duration: '1h' }
```

## Adding New Ambient Sounds

Add entries to the `ambientSounds` array in `src/data/catalog.js`:
```js
{ id: 'YOUTUBE_VIDEO_ID', title: 'Sound Name', icon: '\u{1F327}', duration: '10h' }
```

## Dependencies

- **react** / **react-dom** (v19) — UI framework
- **vite** (v7) — Build tool and dev server
- **eslint** — Linting

No runtime dependencies beyond React. Audio is handled entirely via browser APIs (Web Audio API, YouTube IFrame API).

## Environment

- Node.js 18+
- Modern browser with Web Audio API support
- Mobile-first design — primary target is Android Chrome in bed
