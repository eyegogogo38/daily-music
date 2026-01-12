
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MusicCard from './components/MusicCard';
import { Song } from './types';
import { fetchMusicRecommendations } from './services/gemini';

const App: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const getRecommendations = useCallback(async (selectedTheme: string) => {
    const trimmedTheme = selectedTheme.trim();
    if (!trimmedTheme) return;

    setLoading(true);
    setError(null);
    try {
      const { recommendations: data, sources: refSources } = await fetchMusicRecommendations(trimmedTheme);
      setRecommendations(data);
      setSources(refSources);
      setHasStarted(true);
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.1, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('매거진 발행 중 오류가 발생했습니다. 테마를 조금 더 구체적으로 입력해 보세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    getRecommendations(theme);
  };

  const featuredSong = recommendations[0];
  const otherSongs = recommendations.slice(1);

  // British Date Formatting Helper
  const getBritishDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    
    const getOrdinal = (n: number) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
    
    return `${day}${getOrdinal(day)} of ${month} ${year}`;
  };

  const currentIssuance = getBritishDate(new Date());

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col selection:bg-black selection:text-white">
      <Header />
      
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 md:px-12">
        {/* Search & Intro Section */}
        <section className="mt-8 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 border-l-2 border-black pl-8 order-1">
            <h2 className="text-lg font-black mb-2 uppercase tracking-[0.3em]">Editorial</h2>
            <p className="text-xs leading-relaxed text-gray-500 font-light mb-6">
              오늘 당신의 출근길을 위해, 우리는 7개의 트랙을 골랐습니다.
              도시의 소음을 지우고 오직 비트와 선율에 집중해 보세요.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['City Pop', 'Midnight', 'Jazz', 'Rainy', 'K-Indie'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setTheme(tag); getRecommendations(tag); }}
                  className="text-[8px] font-black border border-black/20 px-3 py-1.5 hover:bg-black hover:text-white transition-all uppercase tracking-widest active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 order-2">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative h-[80px] md:h-[110px] flex items-end overflow-hidden">
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="테마를 입력하세요..."
                  className="w-full bg-transparent py-4 px-0 text-3xl md:text-5xl lg:text-6xl font-display focus:outline-none placeholder:text-gray-200 disabled:text-black leading-none"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={loading || !theme.trim()}
                  className="absolute right-0 bottom-4 font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] hover:translate-x-2 transition-transform disabled:opacity-20 z-10"
                >
                  {loading ? 'Curating...' : 'Assemble →'}
                </button>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black pointer-events-none"></div>
              </div>
            </form>
          </div>
        </section>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 md:py-32">
            <div className="w-12 h-[1px] bg-black mb-8 animate-[loading_1.5s_infinite] origin-left"></div>
            <p className="font-display text-3xl md:text-4xl tracking-tighter text-center italic animate-pulse">
              Curating soundtrack...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-black text-white p-10 font-display text-xl text-center mb-32">
            {error}
            <button onClick={() => getRecommendations(theme)} className="block mx-auto mt-6 text-[9px] font-black border border-white px-6 py-2 hover:bg-white hover:text-black transition-all">Retry</button>
          </div>
        )}

        {!loading && hasStarted && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {featuredSong && <MusicCard song={featuredSong} index={0} isFeatured={true} />}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <div className="lg:col-span-8 space-y-1">
                <h4 className="text-[9px] font-black uppercase tracking-[0.5em] border-b border-black mb-6 pb-2 inline-block">The Playlist</h4>
                {otherSongs.map((song, idx) => (
                  <MusicCard key={`${song.title}-${idx}`} song={song} index={idx + 1} />
                ))}
              </div>
              
              <div className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-12 border-l border-black/5 pl-8 overflow-hidden">
                  <h4 className="font-display text-2xl mb-4 text-black tracking-tighter">Editorial Note</h4>
                  <div className="bg-black/5 p-6 mb-8 border border-black/5">
                    <p className="text-sm font-light leading-relaxed italic text-gray-700">
                      "음악은 우리가 어디로 가고 있는지보다, 우리가 누구인지를 더 잘 설명해 줍니다."
                    </p>
                  </div>
                  <button onClick={() => getRecommendations(theme)} className="w-full border border-black py-4 font-black uppercase tracking-[0.3em] text-[8px] hover:bg-black hover:text-white transition-all">Refresh Issue</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasStarted && !loading && (
          <div className="py-4 animate-in fade-in duration-1000">
            <div className="relative overflow-hidden group border border-black/5 shadow-sm">
              <img src="https://loremflickr.com/1600/600/urban,lifestyle,minimal?random=99" alt="Urban Life" className="w-full h-[300px] md:h-[380px] object-cover grayscale brightness-[0.4] transition-all duration-1000 group-hover:brightness-[0.6]" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="bg-white/85 p-6 md:p-8 max-w-lg text-center backdrop-blur-sm shadow-2xl magazine-border">
                  <h2 className="font-display text-3xl md:text-5xl mb-2 leading-none uppercase tracking-tighter">Urban <span className="font-serif italic lowercase text-gray-400">rhythm.</span></h2>
                  <p className="text-[10px] md:text-[11px] leading-relaxed text-gray-500 font-light mb-5 uppercase tracking-widest">오늘의 감성을 입력하고 매거진을 발행하세요.</p>
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-6 h-[1px] bg-black/10"></div>
                    <span className="text-[7px] font-black uppercase tracking-[0.4em]">Iss. {currentIssuance}</span>
                    <div className="w-6 h-[1px] bg-black/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Refined Minimal Dark Footer - Neutral Grey Palette */}
      <footer className="mt-32 py-16 px-6 bg-[#0c0c0c]">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 pb-10 border-b border-white/5">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-4xl text-neutral-500 uppercase tracking-tighter leading-none">CR</h2>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-700">Commute Rhythm Media</span>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-4 text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="text-neutral-600 hover:text-neutral-400 cursor-default transition-colors">Seoul, KR</span>
              <span className="text-neutral-600 hover:text-neutral-400 cursor-default transition-colors">Digital Edition</span>
              <span className="text-neutral-600 hover:text-neutral-400 cursor-default transition-colors">AI Curation</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-light tracking-[0.1em] uppercase text-neutral-700">
              © 2024 Commute Rhythm. Crafted with neutral gray scales.
            </p>
            <div className="flex gap-4 opacity-10">
              <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
