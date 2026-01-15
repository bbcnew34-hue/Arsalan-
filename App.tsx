
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { VideoFile } from './types';
import Sidebar from './components/Sidebar';
import MainPlayer from './components/MainPlayer';
import { LayoutGrid, Play, Film, Settings, Info, Search } from 'lucide-react';

const App: React.FC = () => {
  const [playlist, setPlaylist] = useState<VideoFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: VideoFile[] = Array.from(files)
      .filter(file => file.type.startsWith('video/'))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));

    setPlaylist(prev => [...prev, ...newFiles]);
    if (currentIndex === -1 && newFiles.length > 0) {
      setCurrentIndex(playlist.length);
    }
  }, [currentIndex, playlist.length]);

  const selectVideo = (index: number) => {
    setCurrentIndex(index);
  };

  const currentVideo = currentIndex >= 0 ? playlist[currentIndex] : null;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-purple-500/30">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        playlist={playlist} 
        currentIndex={currentIndex}
        onSelect={selectVideo}
        onUpload={handleFileUpload}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        {currentVideo ? (
          <MainPlayer 
            video={currentVideo} 
            onNext={() => setCurrentIndex((prev) => (prev + 1) % playlist.length)}
            onPrevious={() => setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/20 rotate-3">
              <Play className="w-12 h-12 text-white fill-white ml-1" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome to NovaPlayer AI</h1>
              <p className="text-gray-400 max-w-md mx-auto">
                The ultimate pro media experience. Drag and drop your videos to get started or use the sidebar to import files.
              </p>
            </div>
            <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-full transition-all active:scale-95 group">
              <span className="flex items-center gap-2 font-medium">
                <LayoutGrid className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                Open Media Library
              </span>
              <input 
                type="file" 
                multiple 
                accept="video/*" 
                className="hidden" 
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </label>
          </div>
        )}

        {/* Floating Header Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
