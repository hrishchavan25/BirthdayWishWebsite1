import { BirthdaySong } from '../types';
import { HAPPY_BIRTHDAY_SONG } from '../data/birthdaySong';

// Convert musical notes to frequencies
const NOTE_FREQS: Record<string, number> = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98
};

export type SoundMood = 'piano' | 'musicbox' | 'waltz';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private playbackTimer: number | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private onTimeUpdateCallback?: (currentTime: number, duration: number) => void;
  private onEndedCallback?: () => void;
  private volume: number = 0.7;
  private elapsedSeconds: number = 0;
  private melodyIndex: number = 0;
  private soundMood: SoundMood = 'piano';
  private loop: boolean = true;
  private songDuration: number = HAPPY_BIRTHDAY_SONG.durationSec;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setSoundMood(mood: SoundMood) {
    this.soundMood = mood;
  }

  public getSoundMood(): SoundMood {
    return this.soundMood;
  }

  public setLoop(val: boolean) {
    this.loop = val;
  }

  public getLoop(): boolean {
    return this.loop;
  }

  public onTimeUpdate(cb: (currentTime: number, duration: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public onEnded(cb: () => void) {
    this.onEndedCallback = cb;
  }

  public playHappyBirthday() {
    this.initContext();
    this.stop();

    this.isPlaying = true;
    this.elapsedSeconds = 0;
    this.melodyIndex = 0;

    this.scheduleNextMelodyStep();

    this.playbackTimer = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.elapsedSeconds += 1;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.elapsedSeconds, this.songDuration);
      }
      if (this.elapsedSeconds >= this.songDuration) {
        if (this.loop) {
          this.elapsedSeconds = 0;
        } else {
          this.stop();
          if (this.onEndedCallback) this.onEndedCallback();
        }
      }
    }, 1000);
  }

  public pause() {
    this.isPlaying = false;
    this.stopOscillators();
  }

  public resume() {
    this.initContext();
    this.isPlaying = true;
    this.scheduleNextMelodyStep();
  }

  public stop() {
    this.isPlaying = false;
    if (this.playbackTimer !== null) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
    this.stopOscillators();
    this.elapsedSeconds = 0;
  }

  private stopOscillators() {
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    this.activeOscillators = [];
  }

  private scheduleNextMelodyStep() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const melody = HAPPY_BIRTHDAY_SONG.melodyNotes;
    if (!melody || melody.length === 0) return;

    const index = this.melodyIndex % melody.length;
    const currentStep = melody[index];
    const tempoMultiplier = this.soundMood === 'waltz' ? 1.15 : this.soundMood === 'musicbox' ? 0.9 : 1.0;
    const duration = (currentStep.duration || 0.4) / tempoMultiplier;

    // Play Lead Melody Note
    const leadType: OscillatorType = this.soundMood === 'musicbox' ? 'sine' : this.soundMood === 'waltz' ? 'triangle' : 'triangle';
    this.playTone(currentStep.note, duration, leadType, 0.4, 0.04);

    // Play Music Box / Bell Overtones
    if (this.soundMood === 'musicbox') {
      this.playChimeTone(currentStep.note, duration * 0.8);
    }

    // Play Harmony Chords
    if (currentStep.chord && currentStep.chord.length > 0) {
      currentStep.chord.forEach((chordNote, idx) => {
        const chordDuration = duration * (this.soundMood === 'waltz' ? 1.8 : 1.5);
        this.playTone(chordNote, chordDuration, 'sine', 0.14, 0.08 + idx * 0.02);
      });
    }

    this.melodyIndex++;

    const delayMs = duration * 1000;
    setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleNextMelodyStep();
      }
    }, delayMs);
  }

  private playTone(
    noteStr: string,
    duration: number,
    type: OscillatorType = 'triangle',
    volumeMultiplier = 0.35,
    attackTime = 0.03
  ) {
    if (!this.ctx || !this.masterGain) return;
    const freq = NOTE_FREQS[noteStr];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(this.volume * volumeMultiplier, now + attackTime);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);

    this.activeOscillators.push(osc);
    setTimeout(() => {
      const idx = this.activeOscillators.indexOf(osc);
      if (idx > -1) this.activeOscillators.splice(idx, 1);
    }, (duration + 0.1) * 1000);
  }

  private playChimeTone(noteStr: string, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const freq = NOTE_FREQS[noteStr];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 2, this.ctx.currentTime); // Octave higher shimmer

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.volume * 0.1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  public playSparkleChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const chimes = ['C5', 'E5', 'G5', 'B5', 'C6', 'E6'];
    const now = this.ctx.currentTime;
    chimes.forEach((note, i) => {
      const freq = NOTE_FREQS[note];
      if (!freq) return;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0.001, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.5);
    });
  }

  public playBeadClick() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Short high pitched wooden/glass bead click
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playCharmJingle() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const notes = ['A5', 'C#6', 'E6', 'A6'];
    const now = this.ctx.currentTime;
    notes.forEach((note, idx) => {
      const freq = NOTE_FREQS[note];
      if (!freq) return;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.001, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.4);
    });
  }

  public playBirthdayFanfare() {
    this.playHappyBirthday();
  }

  public getFrequencyData(): number[] {
    if (!this.analyser) {
      return Array(16).fill(0);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    const result: number[] = [];
    const step = Math.floor(dataArray.length / 16);
    for (let i = 0; i < 16; i++) {
      result.push(dataArray[i * step] || 0);
    }
    return result;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
