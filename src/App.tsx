import { useState, useMemo, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Globe, ChevronUp, ChevronDown, Plane, MapPin, 
  Radio, Activity, Users, Layout, Grid, List, Type,
  TrendingUp, Award, Clock
} from 'lucide-react';

type LayoutMode = 'TERMINAL' | 'BENTO' | 'SWISS' | 'MAP' | 'EDIT';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isAscending, setIsAscending] = useState(false);

  const totalTeams = useMemo(() => {
    return teamsData.reduce((acc, curr) => acc + curr.count, 0);
  }, [teamsData]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...teamsData];
    if (searchTerm) {
      result = result.filter(item => 
        item.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result.sort((a, b) => isAscending ? a.count - b.count : b.count - a.count);
    return result;
  }, [teamsData, searchTerm, isAscending]);

  const handleUpdateCount = (id: string, newCount: number) => {
    setTeamsData(prev => prev.map(item => item.id === id ? { ...item, count: newCount } : item));
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-700 ${
      layoutMode === 'TERMINAL' ? 'bg-neutral-950 text-neutral-400' : 
      layoutMode === 'SWISS' ? 'bg-white text-black' : 
      layoutMode === 'MAP' ? 'bg-[#0f172a] text-white' : 'bg-transparent text-gray-900'
    }`}>
      {/* Dynamic Sky Background - Only for Bento Layout */}
      {layoutMode === 'BENTO' && (
        <div className="fixed inset-0 z-[-1] bg-sky-100 pointer-events-none" />
      )}
      
      {/* Layout Switcher Floating Menu */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-black/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl overflow-x-auto max-w-[95vw]">
        <LayoutButton 
          active={layoutMode === 'MAP'} 
          onClick={() => setLayoutMode('MAP')}
          icon={<Globe className="w-4 h-4" />}
          label="Map"
        />
        <LayoutButton 
          active={layoutMode === 'BENTO'} 
          onClick={() => setLayoutMode('BENTO')}
          icon={<Grid className="w-4 h-4" />}
          label="Bento"
        />
        <LayoutButton 
          active={layoutMode === 'TERMINAL'} 
          onClick={() => setLayoutMode('TERMINAL')}
          icon={<Plane className="w-4 h-4" />}
          label="Terminal"
        />
        <LayoutButton 
          active={layoutMode === 'SWISS'} 
          onClick={() => setLayoutMode('SWISS')}
          icon={<Type className="w-4 h-4" />}
          label="Swiss"
        />
        <div className="w-px h-6 bg-white/20 mx-1" />
        {isAdmin && (
          <LayoutButton 
            active={layoutMode === 'EDIT'} 
            onClick={() => setLayoutMode('EDIT')}
            icon={<Activity className="w-4 h-4" />}
            label="Edit Info"
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {layoutMode === 'MAP' && (
          <MapLayout 
            data={filteredAndSortedData} 
            total={totalTeams}
          />
        )}
        {layoutMode === 'TERMINAL' && (
          <TerminalLayout 
            data={filteredAndSortedData} 
            total={totalTeams}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isAscending={isAscending}
            setIsAscending={setIsAscending}
          />
        )}
        {layoutMode === 'BENTO' && (
          <BentoLayout 
            data={filteredAndSortedData} 
            total={totalTeams}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onLayoutChange={setLayoutMode}
            isAdmin={isAdmin}
          />
        )}
        {layoutMode === 'SWISS' && (
          <SwissLayout 
            data={filteredAndSortedData} 
            total={totalTeams}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
        {layoutMode === 'EDIT' && (
          <EditLayout 
            data={teamsData} 
            onUpdate={handleUpdateCount} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LayoutButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-widest whitespace-nowrap ${
        active ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-[10px] md:text-xs">{label}</span>
    </button>
  );
}

// --- MAP LAYOUT (NEW) ---
function MapLayout({ data, total }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col pt-12 pb-32"
    >
      <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center flex-1">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-2 flex items-center justify-center gap-4"
          >
            <Globe className="text-blue-500" /> BINGLE ROAD MAP
          </motion.h1>
          <p className="text-blue-200/50 uppercase tracking-[0.3em] font-bold text-xs">Real-time Global Participation Distribution</p>
          <div className="mt-8 inline-flex bg-blue-500/10 border border-blue-500/20 px-6 py-3 rounded-2xl gap-8">
            <div className="text-center">
               <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">신청 지역</p>
               <p className="text-2xl font-black">{data.length}</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
               <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">총 신청 팀</p>
               <p className="text-2xl font-black">{total}</p>
            </div>
          </div>
        </header>

        {/* The Map Interface */}
        <div className="relative w-full aspect-[2/1] bg-blue-500/5 rounded-[3rem] border border-blue-500/10 overflow-hidden shadow-2xl">
           {/* Stylized World Grid Background */}
           <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
           
           {/* Simplified Abstract World Outlines (SVG) */}
           <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 50">
             <path d="M10,20 Q15,10 25,15 T40,25 T55,20 T70,30 T85,25" stroke="currentColor" fill="none" strokeWidth="0.5" />
             <path d="M15,40 Q25,35 40,42 T60,35 T85,45" stroke="currentColor" fill="none" strokeWidth="0.5" />
           </svg>

           {/* Data Points */}
           {data.map((item: any, idx: number) => (
             <motion.div
               key={item.id}
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: idx * 0.1, type: 'spring' }}
               style={{ top: `${item.lat}%`, left: `${item.lng}%` }}
               className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
             >
               <div className="relative">
                 {/* Visual Pulse */}
                 <div className="absolute -inset-4 bg-blue-500/40 rounded-full animate-ping opacity-20" />
                 
                 {/* Main Marker */}
                 <div className="relative bg-blue-600 hover:bg-white hover:text-blue-600 transition-all shadow-lg shadow-blue-900/50 p-2 md:p-3 rounded-2xl flex flex-col items-center gap-1 border border-blue-400/30">
                    <span className="text-lg md:text-xl">{item.flag}</span>
                    <span className="text-xs md:text-sm font-black tabular-nums">{item.count}</span>
                 </div>

                 {/* Tooltip on Hover */}
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                    <div className="bg-white text-black px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap">
                       <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{item.country}</p>
                       <p className="text-xl font-black">{item.count} Team</p>
                    </div>
                    <div className="w-3 h-3 bg-white rotate-45 mx-auto -mt-1.5 shadow-2xl" />
                 </div>
               </div>
             </motion.div>
           ))}
        </div>

        <div className="mt-12 text-blue-200/30 text-[10px] font-mono tracking-widest uppercase flex items-center gap-4">
           <span>Coordinate Data Loaded</span>
           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
           <span>System Stable</span>
        </div>
      </div>
    </motion.div>
  );
}

// --- EDIT LAYOUT (NEW) ---
function EditLayout({ data, onUpdate }: { data: TeamData[], onUpdate: (id: string, count: number) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 py-20 pb-40"
    >
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6" />
           </div>
           <div>
              <h2 className="text-3xl font-black tracking-tight">참가 팀 수 직접 수정</h2>
              <p className="text-gray-500 font-medium">실시간으로 데이터를 변경하여 시각적 효과를 확인해보세요.</p>
           </div>
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

        <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100">
           <p className="text-blue-900 font-bold mb-2">💡 팁: 숫자를 크게(50 이상) 변경해보세요!</p>
           <p className="text-blue-800/70 text-sm">변경한 숫자는 즉시 지도(Map)와 대시보드(Bento) 레이아웃에서도 반영되어 시각적 비중이 달라집니다.</p>
        </div>
      </div>
    </motion.div>
  );
}

// --- TERMINAL LAYOUT ---
function TerminalLayout({ data, total, searchTerm, setSearchTerm, isAscending, setIsAscending }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 font-mono select-none"
    >
      <header className="border-b border-neutral-900 sticky top-0 bg-neutral-950/80 backdrop-blur-md z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-2 py-0.5 border border-blue-500/50 text-blue-500 text-[10px] font-black uppercase tracking-tighter animate-pulse">
                <Radio className="w-3 h-3" /> LIVE FEED
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white italic">BINGLE ROAD <span className="text-blue-500 font-mono not-italic text-sm ml-2">v2.0</span></h1>
          </div>
          <div className="bg-neutral-900 p-4 border border-neutral-800 flex items-center gap-8 rounded-lg">
             <div className="space-y-1">
               <p className="text-[10px] text-neutral-500 uppercase tracking-widest">총 신청 팀</p>
               <p className="text-2xl font-black text-white tabular-nums">{total}</p>
             </div>
             <div className="w-px h-10 bg-neutral-800" />
             <div className="text-[10px] text-green-500 font-black animate-pulse">CONNECTED</div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 uppercase placeholder:text-neutral-800"
              placeholder="Filter by country..."
            />
          </div>
          <button onClick={() => setIsAscending(!isAscending)} className="px-6 bg-neutral-900 border border-neutral-800 text-white text-xs font-bold uppercase hover:bg-neutral-800">
            {isAscending ? 'Min-Max' : 'Max-Min'}
          </button>
        </div>

        <div className="border border-neutral-800 rounded overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-900 text-[10px] font-black uppercase text-neutral-500 tracking-widest">
             <div className="col-span-6">Destination</div>
             <div className="col-span-3 text-center">Status</div>
             <div className="col-span-3 text-right">Count</div>
          </div>
          {data.map((item: any) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-5 bg-black border-t border-neutral-900 hover:bg-neutral-900 transition-all group">
              <div className="col-span-6 flex items-center gap-4">
                <span className="text-2xl">{item.flag}</span>
                <span className="text-lg font-black text-white tracking-widest group-hover:text-amber-400">{item.country}</span>
              </div>
              <div className="col-span-3 flex items-center justify-center">
                <span className={`px-2 py-0.5 text-[9px] font-black rounded border ${
                   item.status === 'LANDED' ? 'border-green-500/30 text-green-500' : 'border-blue-500/30 text-blue-500'
                }`}>{item.status}</span>
              </div>
              <div className="col-span-3 text-right text-3xl font-black text-white tabular-nums group-hover:text-blue-500">
                {item.count.toString().padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// --- BENTO LAYOUT ---
function BentoLayout({ data, total, searchTerm, setSearchTerm, onLayoutChange, isAdmin }: any) {
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
          <p className="text-gray-500 text-lg font-medium max-w-md tabular-nums">현재 {timeString} 기준의 신청 현황</p>
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
          // Make the top 2 cards wider
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
              {/* Background Accent - Flag */}
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

        {/* New Horizontally Wide CTA Card - Spanning Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => window.open('http://smile.bing.co.kr/myoffice/ezBoardSTD/BoardItemView_Cross.aspx?ShowAdjacent=&ItemID={F614DC6F-62EE-438D-BD35-05A4181D45BC}&BoardID={01d1bffc-8797-68b2-c539-5c1bf48f299c}&location=GENERAL', '_blank')}
          className="col-span-1 sm:col-span-2 lg:col-span-4 h-64 bg-yellow-400 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-yellow-100 group hover:bg-yellow-300 transition-all cursor-pointer border-4 border-white gap-8 relative overflow-hidden"
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
              <p className="text-yellow-950 font-black italic text-3xl md:text-5xl tracking-tighter">BinglRoad</p>
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
            데이터 수정
          </button>
        </div>
      )}
    </motion.div>
  );
}

// --- SWISS LAYOUT ---
function SwissLayout({ data, total }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 py-20 pb-40 font-sans"
    >
      <div className="border-l-8 border-black pl-8 mb-32 space-y-6">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-8">
          STATUS <br />
          REPORT
        </h1>
        <div className="flex items-center gap-6">
          <div className="text-xs font-black uppercase tracking-[0.4em] text-gray-300">Issue № 02</div>
          <div className="flex-1 h-px bg-gray-200" />
          <div className="text-xs font-black uppercase tracking-[0.4em]">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.6em] text-gray-400 mb-8">지표 요약</div>
          <div className="border-t-2 border-black pt-4">
             <span className="text-sm font-black uppercase tracking-widest text-blue-600 block mb-2">총 신청 팀</span>
             <h2 className="text-9xl font-black tracking-tighter tabular-nums">{total}</h2>
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-lg leading-relaxed text-gray-500 font-medium border-l-2 border-gray-100 pl-6">
            현재 10개 전략 지역에서 공식적으로 접수되었습니다. 인도가 전체 신청량의 상당 부분을 차지하며 폭발적인 성장을 기록하고 있습니다. 
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item: any, idx: number) => (
          <div key={item.id} className="group cursor-default py-6 border-b border-gray-100 flex items-center justify-between hover:bg-blue-600 hover:text-white transition-all px-4 -mx-4">
            <div className="flex items-center gap-8">
              <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-blue-200">{(idx + 1).toString().padStart(2, '0')}</span>
              <span className="text-3xl grayscale group-hover:grayscale-0 group-hover:scale-125 transition-transform">{item.flag}</span>
              <h3 className="text-3xl font-black tracking-tight">{item.country}</h3>
            </div>
            <span className="text-6xl font-black tracking-tighter tabular-nums">{item.count}</span>
          </div>
        ))}
      </div>
      <footer className="mt-40 border-t border-black pt-8 flex items-end justify-between">
         <div className="text-[40px] font-black italic tracking-tighter">BINGLE.</div>
         <div className="text-right text-[10px] font-black uppercase tracking-widest space-y-1">
            <p className="text-gray-400">Prepared by Research Lab</p>
            <p>Tokyo • Seoul • New York</p>
         </div>
      </footer>
    </motion.div>
  );
}
