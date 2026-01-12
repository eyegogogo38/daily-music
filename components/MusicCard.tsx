
import React from 'react';
import { Song } from '../types';

interface MusicCardProps {
  song: Song;
  index: number;
  isFeatured?: boolean;
}

const MusicCard: React.FC<MusicCardProps> = ({ song, index, isFeatured = false }) => {
  const youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + ' ' + song.title)}`;
  
  // Create a stable numeric ID for the image based on the song title and artist
  const getStableId = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash % 1000);
  };

  const imageId = getStableId(song.title + song.artist);
  const imageUrl = `https://picsum.photos/id/${imageId}/${isFeatured ? '800/1000' : '400/400'}`;
  
  if (isFeatured) {
    return (
      <a 
        href={youtubeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block mb-24 overflow-hidden border-b border-black pb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 overflow-hidden bg-gray-200 aspect-[4/5] relative">
            <img 
              src={imageUrl} 
              alt={song.title} 
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/800/1000?random=${index}`;
              }}
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              The Cover Story
            </div>
          </div>
          <div className="md:col-span-5 flex flex-col justify-center">
            <span className="font-serif text-xl mb-2 text-gray-500 uppercase tracking-widest">Pick of the Day</span>
            <h2 className="text-6xl md:text-7xl font-display leading-tight mb-4 transition-all duration-300">
              {song.title}
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black"></span>
              <p className="text-2xl font-black uppercase tracking-tighter">{song.artist}</p>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed font-light mb-8">
              "{song.reason}"
            </p>
            <div className="text-sm font-bold uppercase tracking-[0.2em] inline-block border-2 border-black px-6 py-3 self-start group-hover:bg-black group-hover:text-white transition-colors">
              Read More & Listen
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a 
      href={youtubeLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-12 gap-6 border-b border-gray-200 py-10 items-start hover:bg-white/50 transition-all duration-300"
    >
      <div className="col-span-3 sm:col-span-2 overflow-hidden aspect-square bg-gray-100">
        <img 
          src={imageUrl} 
          alt={song.title} 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/400/400?random=${index}`;
          }}
        />
      </div>
      <div className="col-span-9 sm:col-span-10">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            {song.origin === 'Korean' ? 'Local Scene' : 'International Archive'}
          </span>
          <span className="font-serif text-lg text-gray-300">#{(index + 1).toString().padStart(2, '0')}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-display mb-1 leading-none group-hover:underline underline-offset-4 decoration-1">
          {song.title}
        </h3>
        <p className="text-lg font-bold uppercase tracking-tight mb-3 text-gray-800">
          {song.artist}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl font-light">
          {song.reason}
        </p>
      </div>
    </a>
  );
};

export default MusicCard;
