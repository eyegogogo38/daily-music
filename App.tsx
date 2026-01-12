
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MusicCard from './components/MusicCard';
import { Song } from './types';
import { fetchMusicRecommendations } from './services/gemini';

const App: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const getRecommendations = useCallback(async (selectedTheme: string) => {
    if (!selectedTheme.trim()) return;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const data = await fetchMusicRecommendations(selectedTheme);
      setRecommendations(data);
      setHasStarted(true);
    } catch (err) {
      setError('음악 목록을 불러오는데 실패했습니다. 다시 시도해 주세요.');
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

  return (
    <div className="min-h-screen pb-32">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Search & Intro Section */}
        <section className="mt-12 mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-display mb-4 uppercase tracking-tight">The Editorial Note</h2>
            <p className="text-sm leading-relaxed text-gray-600 font-light mb-8">
              출퇴근의 지루함은 당신의 취향을 방해하는 가장 큰 적입니다. 
              오늘 우리는 당신이 입력한 영감을 바탕으로, 아스팔트 위의 시간을 예술로 바꿔줄 7개의 트랙을 선정했습니다. 
              커피 한 잔과 함께, 음악의 깊이를 느껴보세요.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['City Pop', 'Midnight', 'Jazz', 'Rainy Day', 'Morning Drive'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setTheme(tag); getRecommendations(tag); }}
                  className="text-[9px] font-bold border border-black/20 px-3 py-1 hover:border-black hover:bg-black hover:text-white transition-all uppercase tracking-widest"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="현재의 무드나 테마를 입력하세요..."
                className="w-full bg-transparent border-b-[3px] border-black py-6 px-0 text-3xl md:text-5xl font-display focus:outline-none placeholder:text-gray-400 transition-all focus:border-gray-400"
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-0 bottom-8 font-black uppercase tracking-[0.4em] text-xs md:text-sm hover:translate-x-2 transition-transform disabled:opacity-30"
              >
                Assemble Content →
              </button>
            </form>
          </div>
        </section>

        {loading && (
          <div className="flex flex-col items-center justify-center py-40 border-y border-black/10">
            <div className="w-16 h-[2px] bg-black mb-8 relative overflow-hidden">
               <div className="absolute inset-0 bg-gray-300 -translate-x-full animate-[loading_1.5s_infinite] origin-left"></div>
               <style>{`
                 @keyframes loading {
                   0% { transform: translateX(-100%); }
                   100% { transform: translateX(100%); }
                 }
               `}</style>
            </div>
            <p className="font-display text-3xl animate-pulse">Designing your auditory experience...</p>
          </div>
        )}

        {error && (
          <div className="bg-black text-white p-8 font-display text-2xl text-center mb-20">
            {error}
          </div>
        )}

        {!loading && hasStarted && (
          <div className="animate-[fadeIn_1s_ease-out]">
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            
            {/* Recommendations Grid */}
            {featuredSong && (
              <MusicCard song={featuredSong} index={0} isFeatured={true} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] border-b border-black mb-6 pb-2 inline-block">The Playlist</h4>
                {otherSongs.map((song, idx) => (
                  <MusicCard key={`${song.title}-${idx}`} song={song} index={idx + 1} />
                ))}
              </div>
              
              <div className="lg:col-span-4">
                <div className="sticky top-12 border-l border-black/10 pl-8 hidden lg:block">
                  <h4 className="font-display text-3xl mb-4 text-gray-400 uppercase tracking-tighter">Daily Digest</h4>
                  <div className="bg-black text-white p-6 mb-8">
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-4">Editorial Recommendation</p>
                    <p className="text-sm font-light leading-relaxed">
                      "음악은 정적 사이의 공간입니다. 오늘의 7개 곡은 당신의 이동 경로 위에 선을 긋고 색을 입힐 것입니다."
                    </p>
                  </div>
                  <button 
                    onClick={() => getRecommendations(theme)}
                    className="w-full border-2 border-black py-4 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all"
                  >
                    Refresh Curation
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-40 text-center max-w-2xl mx-auto border-t border-black pt-20">
              <span className="font-display text-2xl block mb-2 uppercase tracking-tight">Did you find your rhythm?</span>
              <p className="text-sm text-gray-500 mb-12 font-light">
                우리의 알고리즘이 아닌 에디토리얼 감성이 마음에 드셨다면, 
                내일 아침 다시 방문하여 새로운 테마로 하루를 시작하세요.
              </p>
              <button 
                onClick={() => getRecommendations(theme)}
                className="inline-block bg-black text-white px-16 py-6 font-black uppercase tracking-[0.4em] text-xs hover:bg-gray-800 transition-all shadow-2xl"
              >
                Regenerate Issue
              </button>
            </div>
          </div>
        )}

        {!hasStarted && !loading && (
          <div className="py-20 animate-[fadeIn_1.5s_ease-out]">
            <div className="mb-20 relative overflow-hidden group">
              <img 
                src="https://loremflickr.com/1400/800/urban,lifestyle,commute?random=1" 
                alt="Editorial Lifestyle" 
                className="w-full h-[600px] object-cover grayscale brightness-[0.4] scale-100 transition-transform duration-[2000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 p-12 max-w-xl text-center backdrop-blur-md magazine-border shadow-2xl">
                  <h2 className="font-display text-5xl mb-6 leading-tight uppercase tracking-tighter">Begin your musical journey here.</h2>
                  <p className="text-sm leading-relaxed text-gray-600 font-light mb-8">
                    당신의 테마를 위 검색창에 입력하세요. <br/>
                    우리가 당신의 출퇴근 시간을 감각적인 순간으로 재구성해드립니다.
                  </p>
                  <div className="w-12 h-[1px] bg-black mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-40 py-12 px-6 border-t border-black/10 text-center">
        <h2 className="font-display text-4xl mb-6 uppercase tracking-widest">Commute Rhythm</h2>
        <div className="flex justify-center gap-8 mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
          <span>About</span>
          <span>Archive</span>
          <span>Terms</span>
          <span>Curated by AI</span>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-300">
          &copy; 2024 CR MEDIA GROUP. ALL RIGHTS RESERVED. PRINTED IN SEOUL.
        </p>
      </footer>
    </div>
  );
};

export default App;
