
import React from 'react';
import { VideoFile } from '../types';
import { 
  Library, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  Music, 
  Video, 
  Clock, 
  Heart,
  Plus
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  playlist: VideoFile[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onUpload: (files: FileList | null) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, playlist, currentIndex, onSelect, onUpload, onToggle }) => {
  return (
    <div className={`relative bg-[#111] border-r border-white/5 transition-all duration-300 flex flex-col ${isOpen ? 'w-80' : 'w-20'}`}>
      <div className="p-6 flex items-center justify-between">
        {isOpen && <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">NovaPlayer</h2>}
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* Navigation Section */}
        <div className="space-y-1">
          <NavItem icon={<Library className="w-5 h-5" />} label="Library" active={isOpen} collapsed={!isOpen} />
          <NavItem icon={<Video className="w-5 h-5" />} label="Videos" collapsed={!isOpen} />
          <NavItem icon={<Music className="w-5 h-5" />} label="Audio" collapsed={!isOpen} />
          <NavItem icon={<Clock className="w-5 h-5" />} label="Recent" collapsed={!isOpen} />
          <NavItem icon={<Heart className="w-5 h-5" />} label="Favorites" collapsed={!isOpen} />
        </div>

        {/* Playlist Section */}
        {isOpen && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
              <span>Playlist ({playlist.length})</span>
              <label className="cursor-pointer hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
                <input type="file" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
              </label>
            </div>
            <div className="space-y-2">
              {playlist.length === 0 ? (
                <div className="text-sm text-gray-600 px-2 py-4 italic">No media loaded</div>
              ) : (
                playlist.map((video, idx) => (
                  <button
                    key={video.id}
                    onClick={() => onSelect(idx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                      currentIndex === idx 
                        ? 'bg-purple-600/10 border border-purple-500/20 text-purple-400' 
                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-sm font-medium truncate">{video.name}</p>
                      <p className="text-[10px] opacity-50 uppercase">Ready</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Upload Section */}
      <div className="p-4">
        <label className={`cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-dashed border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all ${!isOpen && 'px-0'}`}>
          <Upload className="w-5 h-5 text-purple-400" />
          {isOpen && <span className="text-sm font-medium">Import Media</span>}
          <input type="file" multiple accept="video/*" className="hidden" onChange={(e) => onUpload(e.target.files)} />
        </label>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, collapsed = false }: { icon: React.ReactNode, label: string, active?: boolean, collapsed?: boolean }) => (
  <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-purple-600 text-white' : 'hover:bg-white/5 text-gray-400 hover:text-white'} ${collapsed && 'justify-center p-4'}`}>
    {icon}
    {!collapsed && <span className="text-sm font-medium">{label}</span>}
  </button>
);

export default Sidebar;
