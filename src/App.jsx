import { useState, useRef } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'

const recordings = [
  "Radio Mirchi 98.3 FM 2026-07-05 07-00-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 07-30-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 08-00-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 08-30-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 09-00-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 09-30-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 10-00-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 10-30-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 11-00-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 11-30-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 12-00-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 12-30-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 13-00-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 13-30-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 14-00-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 14-30-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 15-00-00.mp3",
  "Radio Mirchi 98.3 FM 2026-07-05 15-30-00.mp3",
]

const RECORDING_DURATION = 30 * 60; // seconds

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [status, setStatus] = useState('Click Play to Listen Live')
  const [currentTrack, setCurrentTrack] = useState(null)

  const audioRef = useRef(null)
  const pauseTimeRef = useRef(null)
  const pausePositionRef = useRef(0)

  const [currentIndex, setCurrentIndex] = useState(0);

  const playFromPosition = (track, position = 0) => {
  const audio = audioRef.current;

  setCurrentTrack(track);
  setCurrentIndex(recordings.indexOf(track));
  
  audio.src = track; // files are directly inside /public
  console.log("Source:", audio.src);
  audio.play()
    .then(() => {
      if (position > 0) {
        const seek = () => {
          audio.currentTime = Math.min(position, audio.duration || position);
          audio.removeEventListener("loadedmetadata", seek);
        };

        if (audio.readyState >= 1) {
          seek();
        } else {
          audio.addEventListener("loadedmetadata", seek);
        }
      }

      setStatus("Playing");
      setIsPlaying(true);
    })
    .catch((err) => {
      console.error("Playback failed:", err);
      setStatus("Unable to play");
    });
};

  const togglePlay = () => {
  const audio = audioRef.current;

  if (!isPlaying) {
    setStatus("Connecting...");

    // First play
    if (!currentTrack) {
      playFromPosition(recordings[currentIndex], 0);
      return;
    }

    // How long the user was away
    const elapsedSeconds = pauseTimeRef.current
      ? (Date.now() - pauseTimeRef.current) / 1000
      : 0;

    // Total time that should have passed in the live stream
    const totalSeconds = pausePositionRef.current + elapsedSeconds;

    // Number of recordings to skip
    const recordingsPassed = Math.floor(
      totalSeconds / RECORDING_DURATION
    );

    // Position inside the new recording
    const newPosition =
      totalSeconds % RECORDING_DURATION;

    // New recording index
    const newIndex =
      (currentIndex + recordingsPassed) % recordings.length;

    setCurrentIndex(newIndex);

    playFromPosition(
      recordings[newIndex],
      newPosition
    );
  } else {
    // Pause
    pausePositionRef.current = audio.currentTime;
    pauseTimeRef.current = Date.now();

    audio.pause();
    setStatus("Paused");
    setIsPlaying(false);
  }
};

const handleEnded = () => {
  pauseTimeRef.current = null;
  pausePositionRef.current = 0;

  const nextIndex =
    (currentIndex + 1) % recordings.length;

  setCurrentIndex(nextIndex);

  playFromPosition(
    recordings[nextIndex],
    0
  );
};

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1f0100] via-[#b30f0f] to-[#8a6a00] px-4">

      <audio ref={audioRef} preload="none" onEnded={handleEnded} />

      {/* Glow blob - top left */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-600 opacity-20 blur-3xl"></div>

      {/* Glow blob - bottom right */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-red-600 opacity-20 blur-3xl"></div>

      {/* Radial spotlight behind the card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.15)_0%,transparent_70%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#8a0f0f] via-[#5c1503] to-[#3d2900] shadow-2xl shadow-red-900/40 border border-red-900/30 px-8 py-10 text-center">

        {/* Radio waves behind logo */}
        <div className="absolute top-2 left-4 w-24 h-14 pointer-events-none">
          <span className="absolute inset-0 rounded-full border border-orange-300 opacity-[0.08] animate-ping [animation-duration:3s]"></span>
          <span className="absolute -inset-4 rounded-full border border-orange-300 opacity-[0.06] animate-ping [animation-duration:3s] [animation-delay:0.5s]"></span>
          <span className="absolute -inset-8 rounded-full border border-orange-300 opacity-[0.04] animate-ping [animation-duration:3s] [animation-delay:1s]"></span>
        </div>

        {/* Logo */}
        <img
          src="/radio-mirchi-logo.png"
          alt="Radio Mirchi"
          className="absolute top-2 left-4 w-24 h-14 object-contain drop-shadow-lg z-10"
        />

        {/* Name + Tagline */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-black tracking-tight text-yellow-300">
            RADIO MIRCHI LIVE STREAM
          </h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            It's Hot
          </p>
        </div>

        {/* Live / Location / Frequency */}
        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 text-red-500 font-bold text-base tracking-wide">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            LIVE
          </span>
          <span className="text-white/30">•</span>
          <span className="text-white/25">Patna</span>
          <span className="text-white/30">•</span>
          <span className="text-yellow-300 font-bold text-base">98.3 FM</span>
        </div>

        {/* Play/Pause Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={togglePlay}
            className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-[#FFB800] via-[#FF6B00] to-[#E1251B] shadow-xl shadow-orange-600/40 transition-transform active:scale-95"
          >
            {isPlaying && (
              <>
                <span className="absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-20 animate-ping"></span>
                <span className="absolute inline-flex h-[130%] w-[130%] rounded-full border border-orange-400/30 animate-ping [animation-duration:2s]"></span>
              </>
            )}
            {isPlaying ? (
              <FaPause className="text-white text-3xl relative z-10" />
            ) : (
              <FaPlay className="text-white text-3xl relative z-10 ml-1" />
            )}
          </button>
        </div>

        {/* Status */}
        <p className="mt-6 text-yellow-200/80 text-sm font-medium tracking-wide">
          {status}
        </p>

        {/* Footer */}
        <p className="mt-10 text-xs text-white/30">
          © 2026 Radio Streaming Interface
        </p>
      </div>
    </div>
  )
}

export default App