
export interface VideoFile {
  id: string;
  file: File;
  url: string;
  name: string;
  duration?: number;
  thumbnail?: string;
}

export interface PlayerState {
  playing: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
  showControls: boolean;
  isLooping: boolean;
  activeSubtitle: string | null;
}

export interface AIAnalysis {
  timestamp: number;
  description: string;
  objects: string[];
  mood: string;
}
