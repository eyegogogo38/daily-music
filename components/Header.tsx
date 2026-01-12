
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="pt-12 pb-8 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-end border-b-[6px] border-black pb-4 gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">The Urban Soundscape Weekly</span>
          <h1 className="text-[14vw] md:text-[10rem] font-display leading-[0.8] tracking-tighter">
            Commute <span className="font-serif font-black">Rhythm</span>
          </h1>
        </div>
        <div className="hidden md:flex flex-col items-end text-right min-w-[200px]">
          <span className="font-serif text-2xl border-b border-black mb-1 w-full pb-1">Special Edition</span>
          <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-widest pt-1">
            <span>Vol. 24 / No. 07</span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between py-2 text-[9px] font-bold uppercase tracking-[0.3em] border-b border-black/10">
        <span>K-Music & Global Soul</span>
        <span className="hidden sm:inline">Daily Curation for the Modern Nomad</span>
        <span>Est. 2024</span>
      </div>
    </header>
  );
};

export default Header;
