
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { VideoFile } from '../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward, 
  Settings, 
  Sparkles,
  RefreshCw,
  Subtitles,
  Zap
} from 'lucide-react';
import { analyzeFrame } from '../services/geminiService';

interface MainPlayerProps {
  video: VideoFile;
  onNext: () => void;
  onPrevious: () => void;
}

const MainPlayer: React.FC<MainPlayerProps> = ({ video, onNext, onPrevious }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Auto-hide controls
  useEffect(() => {
    let timeout: number;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleAIAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    setAnalysisResult("AI is thinking...");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      const result = await analyzeFrame(base64Image);
      setAnalysisResult(result);
    }
    
    setIsAnalyzing(false);
  };

  const formatTime = (time: number) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div ref={containerRef} className="flex-1 bg-black relative group flex flex-col justify-center overflow-hidden">
      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-contain cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />

      {/* AI Analysis Overlay */}
      {analysisResult && (
        <div className="absolute top-20 left-10 max-w-sm z-40 animate-in slide-in-from-left duration-500">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl relative">
            <button 
              onClick={() => setAnalysisResult(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              ×
            </button>
            <div className="flex items-center gap-2 mb-3 text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Nova AI Insight</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed font-light italic">
              "{analysisResult}"
            </p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 transition-opacity duration-500 flex flex-col justify-between ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Top Bar */}
        <div className="p-8 flex justify-between items-center">
          <h2 className="text-lg font-medium drop-shadow-lg max-w-2xl truncate">{video.name}</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAIAnalyze}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${isAnalyzing ? 'bg-purple-600 animate-pulse' : 'bg-white/10 hover:bg-white/20 backdrop-blur-lg'}`}
            >
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-purple-400 fill-purple-400" />}
              <span className="text-xs font-bold uppercase tracking-widest">Deep Scan</span>
            </button>
            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Big Play Pause (Center) */}
        {!isPlaying && (
          <button 
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-110 transition-transform active:scale-95 z-20"
          >
            <Play className="w-10 h-10 fill-white text-white ml-1" />
          </button>
        )}

        {/* Bottom Bar */}
        <div className="p-8 space-y-6">
          {/* Progress Bar */}
          <div className="group relative flex items-center h-4">
             <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="absolute w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer group-hover:h-1.5 transition-all outline-none accent-purple-500"
            />
            <div 
              className="h-1.5 bg-purple-500 rounded-full pointer-events-none transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button onClick={onPrevious} className="text-white/70 hover:text-white transition-colors"><SkipBack className="w-6 h-6" /></button>
                <button onClick={togglePlay} className="text-white hover:text-purple-400 transition-colors">
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </button>
                <button onClick={onNext} className="text-white/70 hover:text-white transition-colors"><SkipForward className="w-6 h-6" /></button>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setIsMuted(!isMuted)}>
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    setIsMuted(v === 0);
                    if (videoRef.current) videoRef.current.volume = v;
                  }}
                  className="w-20 accent-purple-500 h-1"
                />
              </div>

              <span className="text-sm font-mono tracking-tighter text-gray-300">
                {formatTime(currentTime)} <span className="text-gray-600">/</span> {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-white/70 hover:text-white flex items-center gap-2">
                <Subtitles className="w-5 h-5" />
                <span className="text-xs font-bold">CC</span>
              </button>
              <button onClick={toggleFullscreen} className="text-white/70 hover:text-white">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPlayer;
