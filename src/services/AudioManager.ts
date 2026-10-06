import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

type SfxKey =
  | 'click'
  | 'correct'
  | 'wrong'
  | 'attack'
  | 'hit'
  | 'victory'
  | 'defeat'
  | 'countdown';

type BgmKey = 'menu' | 'fight';

const SFX_SOURCES = {
  click: require('../../assets/audio/sfx_click_menu.mp3'),
  punch: require('../../assets/audio/sfx_punch.mp3'),
} as const;

const BGM_SOURCES = {
  menu: require('../../assets/audio/bgm_main_menu.mp3'),
  fight: require('../../assets/audio/bgm_fight.mp3'),
} as const;

const SFX_MAP: Record<SfxKey, keyof typeof SFX_SOURCES> = {
  click: 'click',
  correct: 'punch',
  wrong: 'click',
  attack: 'punch',
  hit: 'punch',
  victory: 'punch',
  defeat: 'click',
  countdown: 'click',
};

/**
 * Centralized audio — BGM + SFX from assets/audio.
 */
class AudioManagerClass {
  private soundEnabled = true;
  private musicEnabled = true;
  private vibrationEnabled = true;
  private initialized = false;
  private bgmPlayer: AudioPlayer | null = null;
  private currentBgm: BgmKey | null = null;
  private sfxPool: Partial<Record<keyof typeof SFX_SOURCES, AudioPlayer>> = {};

  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: 'duckOthers',
      });
      this.initialized = true;
    } catch {
      this.initialized = false;
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      void this.stopMusic();
    } else if (this.currentBgm) {
      void this.playBgm(this.currentBgm);
    }
  }

  setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled;
  }

  private getSfxPlayer(key: keyof typeof SFX_SOURCES): AudioPlayer | null {
    try {
      if (!this.sfxPool[key]) {
        const player = createAudioPlayer(SFX_SOURCES[key]);
        player.volume = 0.9;
        this.sfxPool[key] = player;
      }
      return this.sfxPool[key] ?? null;
    } catch {
      return null;
    }
  }

  async play(key: SfxKey): Promise<void> {
    if (!this.soundEnabled) return;
    try {
      await this.init();
      const sourceKey = SFX_MAP[key];
      const player = this.getSfxPlayer(sourceKey);
      if (!player) return;
      await player.seekTo(0);
      player.play();
    } catch {
      // keep game running if audio fails
    }
  }

  async playBgm(track: BgmKey): Promise<void> {
    this.currentBgm = track;
    if (!this.musicEnabled) return;
    try {
      await this.init();
      if (this.bgmPlayer && this.currentBgm === track && this.bgmPlayer.playing) {
        return;
      }
      await this.stopMusic(false);
      const player = createAudioPlayer(BGM_SOURCES[track]);
      player.loop = true;
      player.volume = 0.45;
      player.play();
      this.bgmPlayer = player;
      this.currentBgm = track;
    } catch {
      // ignore
    }
  }

  /** @deprecated use playBgm('menu') */
  async playMusic(): Promise<void> {
    await this.playBgm('menu');
  }

  async stopMusic(clearTrack = true): Promise<void> {
    try {
      if (this.bgmPlayer) {
        this.bgmPlayer.pause();
        this.bgmPlayer.remove();
        this.bgmPlayer = null;
      }
    } catch {
      // ignore
    }
    if (clearTrack) this.currentBgm = null;
  }

  async vibrate(_style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
    // vibration reserved for settings; SFX already play
  }
}

export const AudioManager = new AudioManagerClass();
