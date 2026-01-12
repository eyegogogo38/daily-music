
import React from 'react';

const Header: React.FC = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString('en-GB', { month: 'short' });
  const year = now.getFullYear();
  
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const formattedDate = `${day}${getOrdinal(day)} ${month} ${year}`;

  return (
    <header className="pt-10 pb-6 px-6 md:px-12 max-w-[1300px] w-full mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-end border-b-[4px] border-black pb-3 gap-4">
        <div className="flex flex-col w-full md:w-auto">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] mb-1">The Urban Soundscape Weekly</span>
          <h1 className="text-[12vw] md:text-[8rem] lg:text-[10rem] font-display leading-[0.8] tracking-tighter break-keep">
            Commute <span className="font-serif font-black">Rhythm</span>
          </h1>
        </div>
        <div className="hidden md:flex flex-col items-end text-right min-w-[180px]">
          <span className="font-serif text-xl border-b border-black mb-1 w-full pb-1">Special Edition</span>
          <div className="flex justify-between w-full text-[9px] font-bold uppercase tracking-widest pt-1">
            <span>Issue 07</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between py-2 text-[8px] font-bold uppercase tracking-[0.3em] border-b border-black/5">
        <span>K-Music & Global Soul</span>
        <span className="hidden sm:inline">Curation for Modern Nomad</span>
        <span>Est. 2024</span>
      </div>
    </header>
  );
};

export default Header;
