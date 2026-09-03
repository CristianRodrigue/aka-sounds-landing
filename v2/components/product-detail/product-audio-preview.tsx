"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { ProductPreviewTrack } from "./product-data";

type AudioIconName = "play" | "pause" | "previous" | "next" | "volume" | "mute";

function AudioIcon({ name }: { name: AudioIconName }) {
  if (name === "play") {
    return <svg className="legacy-audio-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4.8 8 5.2-8 5.2V4.8Z" fill="currentColor" stroke="none" /></svg>;
  }
  if (name === "pause") {
    return <svg className="legacy-audio-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.5v11M13.5 4.5v11" /></svg>;
  }
  if (name === "previous") {
    return <svg className="legacy-audio-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 4v12M15 5 8 10l7 5V5Z" fill="currentColor" stroke="none" /></svg>;
  }
  if (name === "next") {
    return <svg className="legacy-audio-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M14.5 4v12M5 5l7 5-7 5V5Z" fill="currentColor" stroke="none" /></svg>;
  }
  if (name === "mute") {
    return <svg className="legacy-audio-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 8h3l4-3v10l-4-3H4V8Z" fill="currentColor" stroke="none" /><path d="m14 8 3 4m0-4-3 4" /></svg>;
  }
  return <svg className="legacy-audio-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 8h3l4-3v10l-4-3H4V8Z" fill="currentColor" stroke="none" /><path d="M14 7.5c1.4 1.4 1.4 3.6 0 5M16 5.5c2.5 2.5 2.5 6.5 0 9" /></svg>;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  if (value < 1) {
    const milliseconds = Math.round((value % 1) * 1000);
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function parseDuration(value: string) {
  const [minutes, seconds] = value.split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}

type ProductAudioPreviewProps = {
  tracks: readonly ProductPreviewTrack[];
  artwork: string;
};

/** The legacy AudioPlayer interaction ported to the current V2 product model. */
export function ProductAudioPreview({ tracks, artwork }: ProductAudioPreviewProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeOnTrackChange = useRef(false);
  const [activeTrack, setActiveTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const current = tracks[activeTrack];
  const totalDuration = duration || (current ? parseDuration(current.duration) : 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (resumeOnTrackChange.current) audio.play().catch(() => setIsPlaying(false));
    resumeOnTrackChange.current = false;
    return () => audio.pause();
  }, [activeTrack]);

  const selectTrack = (index: number, startPlaying = isPlaying) => {
    if (!tracks.length) return;
    const nextIndex = (index + tracks.length) % tracks.length;
    resumeOnTrackChange.current = startPlaying;
    if (nextIndex === activeTrack) {
      if (startPlaying) audioRef.current?.play().catch(() => setIsPlaying(false));
      return;
    }
    setActiveTrack(nextIndex);
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const handleEnded = () => {
    if (activeTrack < tracks.length - 1) selectTrack(activeTrack + 1, true);
    else {
      setIsPlaying(false);
      setCurrentTime(totalDuration);
    }
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolume = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.target.value);
    const audio = audioRef.current;
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
    if (audio) {
      audio.volume = nextVolume;
      audio.muted = nextVolume === 0;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audio) audio.muted = nextMuted;
  };

  if (!current) return null;
  const playbackLabel = isPlaying ? "Pause preview" : "Play preview";
  const muteLabel = isMuted ? "Unmute preview" : "Mute preview";

  return (
    <div className="legacy-audio-player">
      <audio
        ref={audioRef}
        src={current.url}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
      />

      <div className="legacy-audio-heading">
        <span className="legacy-audio-overline">SOUND DESIGN / PREVIEW PLAYER</span>
        <h3>THE NEXT GENERATION OF HARD TECHNO SOUND DESIGN</h3>
      </div>

      <div className="legacy-audio-current">
        <div className="legacy-audio-current-artwork"><img src={artwork} alt="" /></div>
        <div className="legacy-audio-current-copy">
          <span className="legacy-audio-current-label">CURRENT TRACK</span>
          <strong>{current.name}</strong>
          <span>{current.type}</span>
        </div>
        <button type="button" className="legacy-audio-current-play" onClick={togglePlayback} aria-label={playbackLabel} title={playbackLabel}><AudioIcon name={isPlaying ? "pause" : "play"} /></button>
      </div>

      <div className="legacy-audio-progress">
        <span>{formatTime(currentTime)}</span>
        <input type="range" min="0" max={Math.max(totalDuration, 0.01)} step="0.001" value={Math.min(currentTime, totalDuration)} onChange={handleSeek} aria-label="Seek preview" />
        <span>{duration ? formatTime(duration) : current.duration}</span>
      </div>

      <div className="legacy-audio-controls" aria-label="Audio controls">
        <button type="button" className="legacy-audio-icon-button" onClick={() => selectTrack(activeTrack - 1)} aria-label="Previous preview" title="Previous preview"><AudioIcon name="previous" /></button>
        <button type="button" className="legacy-audio-main-button" onClick={togglePlayback} aria-label={playbackLabel} title={playbackLabel}><AudioIcon name={isPlaying ? "pause" : "play"} /></button>
        <button type="button" className="legacy-audio-icon-button" onClick={() => selectTrack(activeTrack + 1)} aria-label="Next preview" title="Next preview"><AudioIcon name="next" /></button>
        <button type="button" className="legacy-audio-icon-button" onClick={toggleMute} aria-label={muteLabel} title={muteLabel}><AudioIcon name={isMuted ? "mute" : "volume"} /></button>
        <input className="legacy-audio-volume" type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolume} aria-label="Preview volume" />
      </div>

      <div className="legacy-audio-playlist" aria-label="Sample preview tracks">
        {tracks.map((track, index) => (
          <button key={track.id} type="button" className={`legacy-audio-track${index === activeTrack ? " is-active" : ""}`} onClick={() => selectTrack(index, true)}>
            <span className="legacy-audio-track-artwork"><img src={artwork} alt="" /></span>
            <span className="legacy-audio-track-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="legacy-audio-track-copy"><strong>{track.name}</strong><small>{track.type}</small></span>
            <span className="legacy-audio-track-duration">{track.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
