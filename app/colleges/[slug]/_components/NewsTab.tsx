import React from 'react';
import { ChevronRight, ImageIcon, Tag } from 'lucide-react';

// Types for your news structure
interface NewsContent {
  title: string;
  content: string;
  is_breaking?: boolean;
  image_url?: string;
}

interface NewsRecord {
  id: number;
  category: string;
  published_date: string | Date;
  news_data: NewsContent;
}

interface NewsTabProps {
  news: NewsRecord[];
  collegeName: string;
}

const NewsTab: React.FC<NewsTabProps> = ({ news, collegeName }) => {
  if (!news || news.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
        <p className="text-slate-400 italic">No recent updates available for {collegeName}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2">
           <span className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
             Total Updates: {news.length}
           </span>
        </div>
      </div>

      {/* Main News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Detailed News List (2/3 of space) */}
        <div className="lg:col-span-2 space-y-4">
          {news.map((item) => {
            const data = item.news_data;
            // const pubDate = new Date(item.published_date);

            return (
              <div 
                key={item.id} 
                className="group flex gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
              >
                
                {/* Date Badge - Reusing your logic */}
             <div className="relative w-full md:w-72 h-48 md:h-auto rounded-xl overflow-hidden shrink-0">
                {data.image_url ? (
                  <img 
                    src={data.image_url} 
                    alt={data.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <ImageIcon className="text-slate-300" size={40} />
                  </div>
                )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {data.is_breaking && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                        Breaking
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                    {data.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {data.content}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                     <button className="text-xs font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
                        Read Full Article <ChevronRight size={14} />
                     </button>
                     <div className="flex gap-3 text-slate-300">
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Mini Sidebar (Quick Category Filter / Highlights) */}
        <div className="space-y-6">
          

           <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-900 text-sm mb-4 flex items-center gap-2">
                <Tag size={16} /> Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Admissions', 'Placements', 'Events', 'Exam'].map(cat => (
                  <button key={cat} className="px-3 py-1 bg-white border border-blue-100 rounded-lg text-[11px] font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                    {cat}
                  </button>
                ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default NewsTab;