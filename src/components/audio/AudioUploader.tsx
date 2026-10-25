import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  Sparkles, 
  Trash2, 
  Sliders,
  Radio
} from 'lucide-react';
import { CELEBRATION_AUDIO_PRESETS, getPresetAudioUrl } from '../../lib/audioPresets';
import type { LovinglyEvent } from '../../types';

interface AudioUploaderProps {
  event: Partial<LovinglyEvent>;
  onChange: (updates: Partial<LovinglyEvent>) => void;
  variant?: 'card' | 'embedded' | 'minimal';
}

function formatSeconds(secs: number): string {
  if (isNaN(secs) || secs < 0) return '00:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function AudioUploader({ event, onChange, variant = 'card' }: AudioUploaderProps) {
  const [activeTab, setActiveTab] = useState<'mp3' | 'spotify'>(
    event.musicType === 'spotify' && !event.bgAudioUrl ? 'spotify' : 'mp3'
  );
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState<number>(event.bgAudioStart || 0);
  const [audioTotalDuration, setAudioTotalDuration] = useState<number>(event.bgAudioDuration || 60);
  const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const onChangeRef = useRef(onChange);
  const eventRef = useRef(event);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    eventRef.current = event;
  }, [event]);

  const startTime = event.bgAudioStart ?? 0;
  const endTime = event.bgAudioEnd ?? Math.min(30, audioTotalDuration);
  const hasAudio = !!event.bgAudioUrl;

  // Cleanup audio preview on unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  // Sync loaded audio element for duration detection and preview
  useEffect(() => {
    if (!event.bgAudioUrl) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      return;
    }

    const audio = new Audio(event.bgAudioUrl);
    previewAudioRef.current = audio;

    const handleLoadedMetadata = () => {
      const dur = Math.round(audio.duration);
      if (dur && !isNaN(dur) && isFinite(dur)) {
        setAudioTotalDuration(dur);
        const currEvent = eventRef.current;
        if (!currEvent.bgAudioDuration || currEvent.bgAudioDuration !== dur) {
          onChangeRef.current({
            bgAudioDuration: dur,
            bgAudioEnd: currEvent.bgAudioEnd ? Math.min(currEvent.bgAudioEnd, dur) : Math.min(30, dur)
          });
        }
      }
    };

    const handleTimeUpdate = () => {
      setCurrentPlayTime(audio.currentTime);
      const currEvent = eventRef.current;
      const targetEnd = currEvent.bgAudioEnd ?? audio.duration;
      if (audio.currentTime >= targetEnd) {
        // Loop back to start
        audio.currentTime = currEvent.bgAudioStart ?? 0;
        audio.play().catch(() => setIsPlayingPreview(false));
      }
    };

    const handleEnded = () => {
      setIsPlayingPreview(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [event.bgAudioUrl]);

  // Handle local MP3 file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (allow up to 12MB)
    if (file.size > 12 * 1024 * 1024) {
      setUploadError('Audio file is too large. Please select an MP3 under 12MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      const dataUrl = uploadEvt.target?.result as string;
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');

      // Create temporary audio element to detect duration
      const tempAudio = new Audio(dataUrl);
      tempAudio.onloadedmetadata = () => {
        const detectedDuration = Math.round(tempAudio.duration) || 60;
        setAudioTotalDuration(detectedDuration);
        onChange({
          musicType: 'mp3',
          bgAudioUrl: dataUrl,
          bgAudioTitle: cleanTitle,
          bgAudioStart: 0,
          bgAudioEnd: Math.min(30, detectedDuration),
          bgAudioDuration: detectedDuration,
          bgAudioAutoPlay: true
        });
      };
      tempAudio.onerror = () => {
        onChange({
          musicType: 'mp3',
          bgAudioUrl: dataUrl,
          bgAudioTitle: cleanTitle,
          bgAudioStart: 0,
          bgAudioEnd: 30,
          bgAudioDuration: 60,
          bgAudioAutoPlay: true
        });
      };
    };

    reader.onerror = () => {
      setUploadError('Failed to read the audio file. Please try another MP3.');
    };

    reader.readAsDataURL(file);
  };

  // Handle preset selection
  const handleSelectPreset = async (presetId: string) => {
    try {
      setLoadingPresetId(presetId);
      setUploadError(null);
      const preset = CELEBRATION_AUDIO_PRESETS.find(p => p.id === presetId);
      const url = await getPresetAudioUrl(presetId);
      setLoadingPresetId(null);

      if (url && preset) {
        setAudioTotalDuration(preset.duration);
        onChange({
          musicType: 'mp3',
          bgAudioUrl: url,
          bgAudioTitle: preset.title,
          bgAudioStart: preset.defaultStart,
          bgAudioEnd: preset.defaultEnd,
          bgAudioDuration: preset.duration,
          bgAudioAutoPlay: true
        });
      }
    } catch (err) {
      console.error(err);
      setLoadingPresetId(null);
      setUploadError('Could not load preset audio.');
    }
  };

  // Toggle preview playback
  const togglePreview = () => {
    if (!previewAudioRef.current) return;
    const audio = previewAudioRef.current;

    if (isPlayingPreview) {
      audio.pause();
      setIsPlayingPreview(false);
    } else {
      audio.currentTime = startTime;
      audio.play()
        .then(() => setIsPlayingPreview(true))
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlayingPreview(false);
        });
    }
  };

  const handleStartChange = (val: number) => {
    const newStart = Math.max(0, Math.min(val, endTime - 2));
    onChange({ bgAudioStart: newStart });
    if (previewAudioRef.current) {
      previewAudioRef.current.currentTime = newStart;
    }
  };

  const handleEndChange = (val: number) => {
    const newEnd = Math.min(audioTotalDuration, Math.max(startTime + 2, val));
    onChange({ bgAudioEnd: newEnd });
  };

  const handleRemoveAudio = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    setIsPlayingPreview(false);
    onChange({
      musicType: event.spotifyUrl ? 'spotify' : 'none',
      bgAudioUrl: '',
      bgAudioTitle: '',
      bgAudioStart: 0,
      bgAudioEnd: 30,
      bgAudioDuration: 0
    });
  };

  const snippetDuration = Math.max(0, endTime - startTime);

  return (
    <div className={`space-y-4 ${variant === 'card' ? 'bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200' : ''}`}>
      {/* Tab Switcher: Custom MP3 Autoplay vs Spotify */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab('mp3');
            if (hasAudio) onChange({ musicType: 'mp3' });
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'mp3'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-rose-600" />
          <span>MP3 Audio (Autoplay)</span>
          <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[9px] font-extrabold rounded">Instant</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('spotify');
            onChange({ musicType: 'spotify' });
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'spotify'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Music className="w-3.5 h-3.5 text-emerald-600" />
          <span>Spotify Track Link</span>
        </button>
      </div>

      {/* Tab 1: MP3 Upload & Trimmer */}
      {activeTab === 'mp3' && (
        <div className="space-y-4">
          {/* Autoplay Highlight Notice */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <span className="font-bold">Seamless Automatic Playback: </span>
              MP3 audio starts playing automatically when guests open your invitation, creating an instant celebration atmosphere without requiring a manual click.
            </div>
          </div>

          {/* If No Audio is selected yet */}
          {!hasAudio ? (
            <div className="space-y-3">
              {/* File Upload Box */}
              <label className="border-2 border-dashed border-stone-300 hover:border-rose-500 hover:bg-rose-50/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center group">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-800 block">Click or Drag to Upload MP3 File</span>
                  <span className="text-[11px] text-stone-500">Supports .mp3, .m4a, .wav audio up to 12MB</span>
                </div>
                <input
                  type="file"
                  accept="audio/mp3,audio/*,.mp3,.m4a,.wav"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <div className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {uploadError}
                </div>
              )}

              {/* Or Select Auspicious Royalty-Free Presets */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                  <span>Or Pick an Auspicious Celebration Melody</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CELEBRATION_AUDIO_PRESETS.map((preset) => {
                    const isLoading = loadingPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        disabled={isLoading}
                        className="p-2.5 rounded-xl border border-stone-200 bg-white hover:border-rose-400 hover:bg-rose-50/20 text-left transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5 truncate pr-2">
                          <div className="text-xs font-bold text-stone-800 group-hover:text-rose-700 truncate">
                            {preset.title}
                          </div>
                          <div className="text-[10px] text-stone-500 truncate">
                            {preset.tagline}
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md font-semibold shrink-0">
                          {isLoading ? 'Loading...' : `${preset.duration}s`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Audio File Configured: Trimmer & Settings */
            <div className="space-y-4 bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
              {/* Active Audio Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Music className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="truncate">
                    <h5 className="text-xs font-bold text-stone-900 truncate">
                      {event.bgAudioTitle || 'Celebration Track'}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500">
                      <span>Total: {formatSeconds(audioTotalDuration)}</span>
                      <span>•</span>
                      <span className="text-rose-700 font-semibold">Snippet: {snippetDuration}s selected</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isPlayingPreview ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-rose-700" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-rose-700" />
                        <span>Preview Selection</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveAudio}
                    title="Remove audio"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Adjust Selection (Trimmer) */}
              <div className="space-y-3 bg-stone-50/70 p-3.5 rounded-xl border border-stone-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Sliders className="w-3.5 h-3.5 text-rose-600" />
                    <span>Adjust Selection / Audio Snippet</span>
                  </div>
                  <div className="text-[11px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md">
                    {formatSeconds(startTime)} ➔ {formatSeconds(endTime)} ({snippetDuration}s)
                  </div>
                </div>

                {/* Visual Audio Progress / Track Bar */}
                <div className="space-y-1.5">
                  <div className="relative h-6 bg-stone-200 rounded-lg overflow-hidden flex items-center">
                    {/* Active Trim Window */}
                    <div
                      style={{
                        left: `${(startTime / audioTotalDuration) * 100}%`,
                        width: `${((endTime - startTime) / audioTotalDuration) * 100}%`
                      }}
                      className="absolute top-0 bottom-0 bg-rose-500/25 border-x-2 border-rose-600"
                    />

                    {/* Live Playback Indicator */}
                    {isPlayingPreview && (
                      <div
                        style={{ left: `${(currentPlayTime / audioTotalDuration) * 100}%` }}
                        className="absolute top-0 bottom-0 w-1 bg-rose-700 shadow-md z-10 transition-all duration-75"
                      />
                    )}

                    {/* Timeline notches */}
                    <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-mono text-stone-500 pointer-events-none">
                      <span>00:00</span>
                      <span>{formatSeconds(audioTotalDuration / 2)}</span>
                      <span>{formatSeconds(audioTotalDuration)}</span>
                    </div>
                  </div>
                </div>

                {/* Sliders for Start & End Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                      <span>Start Point</span>
                      <span className="font-mono text-stone-900 font-bold">{formatSeconds(startTime)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, endTime - 2)}
                      step={1}
                      value={startTime}
                      onChange={(e) => handleStartChange(Number(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                      <span>End Point</span>
                      <span className="font-mono text-stone-900 font-bold">{formatSeconds(endTime)}</span>
                    </div>
                    <input
                      type="range"
                      min={Math.min(audioTotalDuration, startTime + 2)}
                      max={audioTotalDuration}
                      step={1}
                      value={endTime}
                      onChange={(e) => handleEndChange(Number(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Quick Snippet Range Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-stone-500 self-center font-bold mr-1">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ bgAudioStart: 0, bgAudioEnd: Math.min(30, audioTotalDuration) });
                    }}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-stone-200 text-stone-700 hover:border-rose-400 hover:text-rose-700 cursor-pointer"
                  >
                    First 30s
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ bgAudioStart: 0, bgAudioEnd: Math.min(15, audioTotalDuration) });
                    }}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-stone-200 text-stone-700 hover:border-rose-400 hover:text-rose-700 cursor-pointer"
                  >
                    Intro (15s)
                  </button>
                  {audioTotalDuration > 45 && (
                    <button
                      type="button"
                      onClick={() => {
                        onChange({ bgAudioStart: 30, bgAudioEnd: Math.min(60, audioTotalDuration) });
                      }}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-stone-200 text-stone-700 hover:border-rose-400 hover:text-rose-700 cursor-pointer"
                    >
                      Chorus (30-60s)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ bgAudioStart: 0, bgAudioEnd: audioTotalDuration });
                    }}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-stone-200 text-stone-700 hover:border-rose-400 hover:text-rose-700 cursor-pointer"
                  >
                    Full Track
                  </button>
                </div>
              </div>

              {/* Autoplay Toggle */}
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                    <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                    <span>Autoplay on Page Load</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Plays audio automatically when visitors open your invitation link.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={event.bgAudioAutoPlay ?? true}
                  onChange={(e) => onChange({ bgAudioAutoPlay: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500 border-stone-300 cursor-pointer"
                />
              </div>

              {/* Replace MP3 Button */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <label className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer inline-flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload different MP3 file</span>
                  <input
                    type="file"
                    accept="audio/mp3,audio/*,.mp3,.m4a,.wav"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Spotify Track Embed */}
      {activeTab === 'spotify' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Spotify Track or Playlist URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={event.spotifyUrl || ''}
                onChange={(e) => {
                  onChange({
                    spotifyUrl: e.target.value,
                    musicType: e.target.value ? 'spotify' : 'none'
                  });
                }}
                placeholder="https://open.spotify.com/track/..."
                className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:border-rose-600 transition-all"
              />
              {event.spotifyUrl && (
                <button
                  type="button"
                  onClick={() => onChange({ spotifyUrl: '' })}
                  className="px-3 py-2 rounded-xl text-stone-500 hover:text-red-600 text-xs font-bold border border-stone-200 hover:bg-stone-50 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="p-3 bg-stone-100/80 rounded-xl text-[11px] text-stone-600 leading-relaxed border border-stone-200">
            <span className="font-bold text-stone-800">Spotify Play Button Notice: </span>
            Due to Spotify browser policies, visitors must tap the Spotify play button to start listening. 
            For <span className="font-bold text-rose-700">instant automatic playback</span> upon page opening without requiring any tap, use the <button type="button" onClick={() => setActiveTab('mp3')} className="underline font-bold text-rose-700 cursor-pointer">MP3 Audio</button> tab.
          </div>
        </div>
      )}
    </div>
  );
}
