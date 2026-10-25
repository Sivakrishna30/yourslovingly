/**
 * Royalty-free celebration audio generator and presets for Yours Lovingly.
 * Generates crisp, warm harmonic WAV audio in-browser using standard Web Audio API
 * so invitations always have instant, zero-latency, copyright-safe audio available,
 * in addition to custom user MP3 uploads.
 */

export interface AudioPreset {
  id: string;
  title: string;
  category: 'wedding' | 'devotional' | 'festive' | 'acoustic' | 'party';
  tagline: string;
  duration: number; // in seconds
  defaultStart: number;
  defaultEnd: number;
}

export const CELEBRATION_AUDIO_PRESETS: AudioPreset[] = [
  {
    id: 'preset-shehnai-mangalyam',
    title: 'Royal Shehnai Mangalyam',
    category: 'wedding',
    tagline: 'Auspicious South & North Indian Wedding Melody with Tanpura',
    duration: 32,
    defaultStart: 0,
    defaultEnd: 30
  },
  {
    id: 'preset-sacred-temple-flute',
    title: 'Sacred Temple Flute',
    category: 'devotional',
    tagline: 'Peaceful Bansuri & Carnatic Divine Harmony',
    duration: 30,
    defaultStart: 0,
    defaultEnd: 28
  },
  {
    id: 'preset-festive-sitar-chimes',
    title: 'Festive Sitar & Chimes',
    category: 'festive',
    tagline: 'Joyous celebration strings and uplifting bells',
    duration: 28,
    defaultStart: 0,
    defaultEnd: 25
  },
  {
    id: 'preset-romantic-acoustic',
    title: 'Acoustic Celebration Warmth',
    category: 'acoustic',
    tagline: 'Heartfelt guitar chords and soft emotional strings',
    duration: 30,
    defaultStart: 0,
    defaultEnd: 26
  },
  {
    id: 'preset-birthday-chimes',
    title: 'Milestone Celebration Chimes',
    category: 'party',
    tagline: 'Sparkling party bells and upbeat celebration cadence',
    duration: 24,
    defaultStart: 0,
    defaultEnd: 20
  }
];

// Helper to convert AudioBuffer to WAV Data URL
function bufferToWavBlob(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  const sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    out.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data: number) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8);  // file length - 8
  setUint32(0x45564157); // "WAVE"

  // FMT sub-chunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16);         // 16 for PCM
  setUint16(1);          // Linear PCM
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2);              // block align
  setUint16(16);                         // 16-bit

  // data sub-chunk
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      // 16-bit signed integer
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out.buffer], { type: 'audio/wav' });
}

// In-memory cache of generated preset blob URLs so we only synthesize once
const presetBlobCache = new Map<string, string>();

/**
 * Synthesizes a melodic celebratory audio clip using Web Audio API
 * and returns a cached Blob URL.
 */
export async function getPresetAudioUrl(presetId: string): Promise<string> {
  if (presetBlobCache.has(presetId)) {
    return presetBlobCache.get(presetId)!;
  }

  const preset = CELEBRATION_AUDIO_PRESETS.find(p => p.id === presetId) || CELEBRATION_AUDIO_PRESETS[0];
  const sampleRate = 22050; // High clarity, lightweight memory
  const duration = preset.duration;
  const numFrames = sampleRate * duration;

  const OfflineAudio = window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;
  if (!OfflineAudio) {
    return '';
  }

  const ctx = new OfflineAudio(2, numFrames, sampleRate);

  // Reverb simulation using delay and gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.65, 0);
  masterGain.connect(ctx.destination);

  // Pentatonic/Raga scale frequencies for celebratory traditional harmony
  let notes: number[];
  let tempo: number;

  if (preset.id === 'preset-shehnai-mangalyam') {
    // Kalyani / Bhairavi Shehnai wedding scale (Sa, Re, Ga, Ma, Pa, Dha, Ni)
    notes = [261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25];
    tempo = 0.55;
  } else if (preset.id === 'preset-sacred-temple-flute') {
    // Mohanam Carnatic scale (Sa, Ri2, Ga3, Pa, Dha2)
    notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
    tempo = 0.7;
  } else if (preset.id === 'preset-festive-sitar-chimes') {
    // Raag Yaman celebration notes
    notes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25];
    tempo = 0.42;
  } else if (preset.id === 'preset-romantic-acoustic') {
    // Warm C Major / E minor acoustic arpeggio
    notes = [196.00, 246.94, 293.66, 329.63, 392.00, 493.88, 587.33];
    tempo = 0.48;
  } else {
    // Upbeat Celebration Chimes
    notes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99];
    tempo = 0.38;
  }

  // Tanpura / drone base resonance (root + fifth)
  const droneOsc1 = ctx.createOscillator();
  droneOsc1.type = 'sawtooth';
  droneOsc1.frequency.setValueAtTime(130.81, 0); // Low C

  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.setValueAtTime(320, 0);

  const droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.08, 0);

  droneOsc1.connect(droneFilter);
  droneFilter.connect(droneGain);
  droneGain.connect(masterGain);
  droneOsc1.start(0);
  droneOsc1.stop(duration);

  // Melodic notes sequence
  const totalNotes = Math.floor(duration / tempo);
  for (let i = 0; i < totalNotes; i++) {
    const startTime = i * tempo;
    const noteDuration = tempo * 1.6; // overlapping warm resonance

    // Harmonic melody note selection
    const noteIdx = (i % 2 === 0 ? (i * 3) : (i * 2 + 1)) % notes.length;
    const freq = notes[noteIdx];

    const osc = ctx.createOscillator();
    // Warm Shehnai / flute wave shape
    osc.type = (preset.id === 'preset-sacred-temple-flute') ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    // Subtle pitch vibrato for expressive human-like flute/shehnai feel
    const vibrato = ctx.createOscillator();
    vibrato.frequency.setValueAtTime(5, startTime);
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.setValueAtTime(freq * 0.015, startTime);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(startTime);
    vibrato.stop(startTime + noteDuration);

    const noteGain = ctx.createGain();
    // Smooth ADSR envelope: soft attack, gentle decay
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + noteDuration);
  }

  const renderedBuffer = await ctx.startRendering();
  const blob = bufferToWavBlob(renderedBuffer);
  const blobUrl = URL.createObjectURL(blob);
  presetBlobCache.set(presetId, blobUrl);
  return blobUrl;
}
