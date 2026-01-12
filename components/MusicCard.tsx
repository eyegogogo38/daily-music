
import React, { useState } from 'react';
import { Song } from '../types';

interface MusicCardProps {
  song: Song;
  index: number;
  isFeatured?: boolean;
}

const MusicCard: React.FC<MusicCardProps> = ({ song, index, isFeatured = false }) => {
  const [thumbStatus, setThumbStatus] = useState<'hq' | 'mq' | 'placeholder'>('hq');
  
  const cleanVideoId = (id: string | undefined) => {
    if (!id || id.length < 11) return null;
    const match = id.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|\/v\/|embed\/))?([^?&"'>\s]{11})/);
    return match ? match[1] : (id.trim().length === 11 ? id.trim() : null);
  };

  const videoId = cleanVideoId(song.videoId);
  const youtubeSearchLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.artist} ${song.title}`)}`;
  
  const getThumbnailUrl = () => {
    if (!videoId) return null;
    if (thumbStatus === 'hq') return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    if (thumbStatus === 'mq') return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    return null;
  };

  const lifeKeywords = ['urban', 'cityscape', 'subway', 'bus', 'walk', 'night-city'];
  const keyword = lifeKeywords[index % lifeKeywords.length];
  const placeholderImg = `https://loremflickr.com/${isFeatured ? '1200/800' : '800/800'}/${keyword},minimal?lock=${index + 500}`;

  const currentImgUrl = (thumbStatus === 'placeholder' || !videoId) ? placeholderImg : getThumbnailUrl();

  const handleImgError = () => {
    if (thumbStatus === 'hq') setThumbStatus('mq');
    else if (thumbStatus === 'mq') setThumbStatus('placeholder');
  };

  if (isFeatured) {
    return (
      <div className="mb-20 overflow-hidden border-b-2 border-black pb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-7 relative group">
            <a 
              href={youtubeSearchLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block overflow-hidden bg-gray-100 aspect-[4/3] md:h-[480px] relative shadow-lg group"
            >
              <img 
                src={currentImgUrl || placeholderImg} 
                alt={song.title} 
                onError={handleImgError}
                className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:brightness-110 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
              
              <div className="absolute inset-0 flex items-end justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-black/80 backdrop-blur-sm px-6 py-3 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl">
                  {videoId ? 'Listen on YouTube ↗' : 'Search on YouTube ↗'}
                </div>
              </div>
            </a>
            <div className="absolute top-6 left-6 bg-black text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] z-10 pointer-events-none">
              Featured Pick
            </div>
          </div>
          <div className="md:col-span-5 flex flex-col pt-4 pr-4 overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 text-gray-400">Issue Selection</span>
            <a href={youtubeSearchLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-display leading-[0.9] mb-4 tracking-tighter break-words">
                {song.title}
              </h2>
            </a>
            <p className="text-2xl font-black uppercase tracking-tighter text-black mb-6 break-all">{song.artist}</p>
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-10 border-l-4 border-black pl-6 italic">
              "{song.reason}"
            </p>
            <div className="flex">
              <a 
                href={youtubeSearchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-8 py-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-gray-800 transition-all shadow-md"
              >
                Listen on YouTube →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group grid grid-cols-12 gap-6 md:gap-8 border-b border-gray-200 py-8 items-start hover:bg-white/40 transition-all duration-500 overflow-hidden">
      <div className="col-span-4 relative overflow-hidden aspect-square bg-gray-50 border border-black/5">
        <a href={youtubeSearchLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
          <img 
            src={currentImgUrl || placeholderImg} 
            alt={song.title} 
            onError={handleImgError}
            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:brightness-110"
          />
          <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
             <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 text-white font-black uppercase tracking-[0.1em] text-[8px]">
               Listen ↗
             </div>
          </div>
        </a>
      </div>
      <div className="col-span-8 pr-2 overflow-hidden">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
            {song.origin === 'Korean' ? 'K-Selection' : 'Global Selection'}
          </span>
          <span className="font-display text-2xl text-gray-200">/ 0{index + 1}</span>
        </div>
        <a href={youtubeSearchLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity block mb-1">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-display leading-none break-words tracking-tighter">
            {song.title}
          </h3>
        </a>
        <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-black border-b border-black/5 pb-1 inline-block max-w-full truncate">
          {song.artist}
        </p>
        <p className="text-sm text-gray-500 leading-relaxed font-light mb-4 line-clamp-3">
          {song.reason}
        </p>
        <a 
          href={youtubeSearchLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[8px] font-black uppercase tracking-[0.2em] text-black border-b border-black/20 pb-0.5 hover:text-gray-400 hover:border-gray-400 transition-all"
        >
          YouTube ↗
        </a>
      </div>
    </div>
  );
};

export default MusicCard;
