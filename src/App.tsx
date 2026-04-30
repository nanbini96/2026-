import { useState, useMemo, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, Activity, TrendingUp
} from 'lucide-react';

type LayoutMode = 'BENTO' | 'EDIT';

interface TeamData {
  id: string;
  country: string;
  count: number;
  flag: string;
  status: 'LANDED' | 'ON TIME' | 'EN ROUTE';
  lat: number;   // For Map positioning (vertical % from top)
  lng: number;   // For Map positioning (horizontal % from left)
}

const INITIAL_DATA: TeamData[] = [
  { id: '1', country: '인도', count: 0, flag: '🇮🇳', status: 'ON TIME', lat: 55, lng: 72 },
  { id: '2', country: '모로코', count: 0, flag: '🇲🇦', status: 'LANDED', lat: 48, lng: 45 },
  { id: '3', country: '튀르키예', count: 0, flag: '🇹🇷', status: 'ON TIME', lat: 45, lng: 58 },
  { id: '4', country: '카자흐스탄', count: 0, flag: '🇰🇿', status: 'EN ROUTE', lat: 38, lng: 68 },
  { id: '5', country: '몽골', count: 0, flag: '🇲🇳', status: 'ON TIME', lat: 38, lng: 80 },
  { id: '6', country: '체코', count: 0, flag: '🇨🇿', status: 'LANDED', lat: 42, lng: 52 },
  { id: '7', country: '이탈리아(밀라노)', count: 0, flag: '🇮🇹', status: 'ON TIME', lat: 45, lng: 50 },
  { id: '8', country: '캐나다 동부(퀘백)', count: 0, flag: '🇨🇦', status: 'EN ROUTE', lat: 42, lng: 28 },
  { id: '9', country: '호주(브리즈번)', count: 0, flag: '🇦🇺', status: 'ON TIME', lat: 78, lng: 91 },
  { id: '10', country: '호주(퍼스)', count: 0, flag: '🇦🇺', status: 'EN ROUTE', lat: 80, lng: 85 },
];

const ADMIN_EMAIL = 'hanbinii96@gmail.com';

export default function App() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('BENTO');
  // In a real app, we would get this from a proper Auth provider
  const [userEmail] = useState(ADMIN_EMAIL);
  const isAdmin = userEmail === ADMIN_EMAIL;

  const [teamsData, setTeamsData] = useState<TeamData[]>(INITIAL_DATA);

  const totalTeams = useMemo(() => {
    return teamsData.reduce((acc, curr) => acc + curr.count, 0);
  }, [teamsData]);

  const handleUpdateCount = (id: string, newCount: number) => {
    setTeamsData(prev => prev.map(item => item.id === id ? { ...item, count: newCount } : item));
  };

  return (
    <div className="relative min-h-screen bg-transparent text-gray-900 font-sans">
      {/* Dynamic Sky Background */}
      <div className="fixed inset-0 z-[-1] bg-sky-100 pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {layoutMode === 'BENTO' && (
          <BentoLayout 
            data={teamsData} 
            total={totalTeams}
            onLayoutChange={setLayoutMode}
            isAdmin={isAdmin}
          />
        )}
        {layoutMode === 'EDIT' && isAdmin && (
          <EditLayout 
            data={teamsData} 
            onUpdate={handleUpdateCount} 
            onClose={() => setLayoutMode('BENTO')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditLayout({ data, onUpdate, onClose }: { data: TeamData[], onUpdate: (id: string, count: number) => void, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 py-20 pb-40"
    >
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-3xl font-black tracking-tight">참가 팀 수 수정</h2>
                <p className="text-gray-500 font-medium">데이터를 실시간으로 업데이트합니다.</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all font-sans"
          >
            닫기
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {data.map((item) => (
             <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:bg-blue-50/30 transition-all">
                <div className="flex items-center gap-3">
                   <span className="text-3xl">{item.flag}</span>
                   <span className="font-bold text-gray-700">{item.country}</span>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={() => onUpdate(item.id, Math.max(0, item.count - 1))}
                     className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-lg font-bold hover:bg-gray-100"
                   >-</button>
                   <input 
                     type="number"
                     value={item.count}
                     onChange={(e) => onUpdate(item.id, parseInt(e.target.value) || 0)}
                     className="w-16 bg-white border border-gray-200 rounded-lg p-2 text-center font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 tabular-nums"
                   />
                   <button 
                     onClick={() => onUpdate(item.id, item.count + 1)}
                     className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-lg font-bold hover:bg-gray-100"
                   >+</button>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100 text-center">
           <p className="text-blue-900 font-bold">💡 데이터가 실시간으로 대시보드(Bento) 레이아웃에 반영됩니다.</p>
        </div>
      </div>
    </motion.div>
  );
}

// --- BENTO LAYOUT ---
function BentoLayout({ data, total, onLayoutChange, isAdmin }: any) {
  const sorted = useMemo(() => [...data].sort((a, b) => b.count - a.count), [data]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const timeString = useMemo(() => {
    return `${currentTime.getFullYear()}년 ${currentTime.getMonth() + 1}월 ${currentTime.getDate()}일 ${currentTime.getHours()}시 ${currentTime.getMinutes()}분`;
  }, [currentTime]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-7xl mx-auto px-6 py-12 pb-32 font-sans"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '40px' }}
            className="h-1.5 bg-blue-600 rounded-full"
          />
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[1.1] text-gray-900">
            2026 빙글로드(<span className="text-blue-600">BinglRoad</span>) <br />
            <span className="text-blue-600 text-5xl md:text-6xl">신청 팀 현황</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-md tabular-nums">{timeString} 기준</p>
        </div>
        
        <div className="bg-blue-600 rounded-[3rem] p-10 md:p-14 text-white flex items-center gap-10 shadow-2xl shadow-blue-500/30 border-4 border-blue-500/20">
          <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <div>
            <p className="text-blue-50 text-lg font-bold uppercase tracking-[0.3em] mb-2">총 신청 팀</p>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter tabular-nums leading-none text-white">
              {total}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sorted.map((item: any, idx: number) => {
          const isLarge = idx < 2;
          return (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`${
                isLarge ? 'md:col-span-2' : 'col-span-1'
              } group relative h-64 rounded-[2.5rem] p-8 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 bg-white/80 backdrop-blur-md text-gray-900 border border-white/40 shadow-xl`}
            >
              <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700 pointer-events-none select-none">
                <span className="text-[12rem] leading-none filter blur-[2px] group-hover:blur-0 transition-all">
                  {item.flag}
                </span>
              </div>

              <div className="relative h-full flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-black/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-6xl drop-shadow-xl relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                      {item.flag}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className={`font-black tabular-nums transition-colors ${
                       item.count > 0 ? 'text-red-600' : 'text-gray-900 group-hover:text-blue-600'
                     } ${isLarge ? 'text-7xl' : 'text-5xl'}`}>
                       {item.count}
                     </span>
                     <span className="text-base font-bold opacity-40 uppercase tracking-widest -mt-1">Team</span>
                  </div>
                </div>

                <div>
                   <h3 className={`font-display font-bold tracking-tighter mb-1 leading-[0.85] ${isLarge ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
                    {item.country.includes('(') ? (
                      <div className="flex flex-col">
                        <span>{item.country.split('(')[0]}</span>
                        <span className={`font-display font-bold tracking-tight text-blue-600 ${isLarge ? 'text-3xl md:text-4xl mt-1' : 'text-2xl md:text-3xl mt-0.5'}`}>
                          ({item.country.split('(')[1]}
                        </span>
                      </div>
                    ) : (
                      item.country
                    )}
                   </h3>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* CTA Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => window.open('http://smile.bing.co.kr/myoffice/ezBoardSTD/BoardItemView_Cross.aspx?ShowAdjacent=&ItemID={F614DC6F-62EE-438D-BD35-05A4181D45BC}&BoardID={01d1bffc-8797-68b2-c539-5c1bf48f299c}&location=GENERAL', '_blank')}
          className="col-span-1 sm:col-span-2 lg:col-span-4 h-64 bg-yellow-400 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-yellow-100 group hover:bg-yellow-300 transition-all cursor-pointer border-4 border-white gap-8 relative overflow-hidden mt-6"
        >
           {/* Decorative Accents */}
           <div className="absolute top-10 left-10 w-32 h-1 bg-white/40 blur-xl rounded-full" />
           <div className="absolute bottom-10 right-20 w-48 h-1 bg-white/20 blur-2xl rounded-full" />
           
           {/* Airplane Graphic Background */}
           <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none transform translate-x-1/4">
             <Plane className="w-96 h-96 text-yellow-950 -rotate-12 group-hover:translate-x-12 transition-transform duration-1000" />
           </div>

           <div className="flex flex-col items-center md:items-start text-center md:text-left relative z-10">
             <div className="bg-black text-white p-4 rounded-2xl mb-4 group-hover:rotate-12 transition-transform shadow-lg flex items-center justify-center">
                <Plane className="w-8 h-8 animate-pulse" />
             </div>
             <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-yellow-950 leading-none whitespace-nowrap">
               지금 바로 도전하세요!
             </h2>
           </div>
           
           <div className="flex-1 flex flex-col justify-center items-center md:items-end gap-4 max-w-md w-full relative z-10">
              <p className="text-yellow-900/60 font-black text-xs uppercase tracking-[0.4em]">Apply Global Initiative</p>
              <div className="w-full h-3 bg-yellow-950/10 rounded-full overflow-hidden border border-yellow-950/5">
                 <motion.div 
                   animate={{ x: ["-100%", "200%"] }} 
                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                   className="w-1/2 h-full bg-yellow-950/40 blur-sm"
                 />
                 <motion.div 
                   animate={{ x: ["-100%", "200%"] }} 
                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                   className="w-1/4 h-full bg-yellow-600/60"
                 />
              </div>
              <p className="text-yellow-950 font-black italic text-4xl md:text-6xl tracking-tighter">BinglRoad</p>
           </div>
        </motion.div>
      </div>

      {isAdmin && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => onLayoutChange('EDIT')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            <Activity className="w-3 h-3" />
            데이터 수정 (인재육성팀 담당자만 수정 가능)
          </button>
        </div>
      )}
    </motion.div>
  );
}
