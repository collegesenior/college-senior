'use client';
import { useState, useTransition, useEffect } from 'react';
import Headers from '../components/Header';
import Footer from '../components/Footer';
type CollegeType = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  ownership: string;
  naac_grade: string;
  nirf_ranking: number;
  established: number;
  website: string;
  email: string;
  phone: string;
  logo_url: string;
  image_url: string;
  overview: string;
  description: string;
  meta_title: string;
  meta_description: string;
  created_at: Date;
  updated_at: Date;
};
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Loader2, MapPin, Mail, Globe } from 'lucide-react';
import Image from 'next/image';
import EnquiryFormModal from '../components/EnquiryFormModal';
import { useScrollTrigger } from '../hooks/useScrollTrigger';

export default function CollegeListClient({
    initialColleges,
    currentParams
}: {
    initialColleges: CollegeType[],
    currentParams: Record<string, string | undefined>
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [localSearch, setLocalSearch] = useState<Record<string, string>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isTriggered } = useScrollTrigger(0.7);

    useEffect(() => {
        if (isTriggered) {
            setIsModalOpen(true);
        }
    }, [isTriggered]);

    const hiddenFields = {
        city: currentParams.city || 'All',
        stream: currentParams.stream || 'All',
        searchQuery: currentParams.search || '',
        sortBy: currentParams.sort || 'ranking'
    };

    // 1. Updated updateFilter with Transition
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (params.get(key) === value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        startTransition(() => {
            router.push(`/colleges?${params.toString()}`, { scroll: false });
        });
    };

    // 2. Updated resetFilters with Transition
    const resetFilters = () => {
        startTransition(() => {
            router.push('/colleges');
        });
    };

    // 3. Updated handleSearchSubmit with Transition
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (searchQuery) {
            params.set('search', searchQuery);
        } else {
            params.delete('search');
        }

        startTransition(() => {
            router.push(`/colleges?${params.toString()}`);
        });
    };

    const handleSort = (sortValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', sortValue);
        startTransition(() => {
            router.push(`/colleges?${params.toString()}`, { scroll: false });
        });
    };

    return (

        <div className="relative min-h-screen bg-gray-100">
            <Headers />

            {/* --- LOADING SPINNER OVERLAY --- */}
            {isPending && (
                <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/60">
                    <div className="p-5 bg-white rounded-2xl flex flex-col items-center border border-gray-100">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-gray-600 mt-3">Updating results...</p>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="max-w-375 mx-auto bg-linear-to-r bg-primary m-3 rounded-2xl text-white pt-4 pb-4 px-4 relative overflow-hidden">
                <div className="max-w-10xl p-4 mx-auto">
                    <div className="z-10 w-full lg:w-2/3">
                        <p className="text-sm opacity-80 mb-2">Home / Colleges</p>
                        <h2 className="text-2xl md:text-4xl font-bold mb-4">Find Your Perfect Colleges</h2>
                        <p className="text-md md:text-lg opacity-90 mb-4">
                            Explore hundreds of colleges to find the right one for you.
                        </p>
                        <form onSubmit={handleSearchSubmit} className="w-full mt-4 flex bg-white p-1 md:p-2 rounded-lg shadow-lg border border-gray-200 text-gray-800">
                            <button type="submit" className="p-2 text-blue-700 hover:text-blue-600 transition">
                                <Search size={20} />
                            </button>
                            <input
                                type="text"
                                placeholder="Search for colleges..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="grow p-2 outline-none placeholder-blue-700"
                            />
                        </form>
                    </div>
                </div>
            </section>

            {/* Mobile Toggle Button */}
            <div className="lg:hidden px-8 mb-2 ">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter Options
                </button>
            </div>

            {/* Main */}
            <main className="max-w-387 mx-auto p-3 md:px-8 md:py-10 flex flex-col lg:flex-row gap-8">
                {/* Mobile Overlay Background */}
                {isFilterOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}

                {/* Filters Sidebar */}
                <aside className={`fixed sm:fixed md:fixed inset-0 z-40 lg:sticky lg:top-25 lg:z-10 w-80 h-240 bg-gray-50 p-10 overflow-y-auto transition-transform duration-300 lg:translate-x-0 lg:w-1/4 lg:block lg:bg-transparent lg:p-0
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} `}>
                    <div className="flex justify-between items-center mb-6 lg:mb-4">
                        <h3 className="font-bold text-lg">Filters</h3>
                        <div className="flex items-center gap-4">
                            <button onClick={resetFilters} className="text-indigo-600 text-sm font-semibold">Reset</button>
                            {/* Close Button for Mobile */}
                            <button onClick={() => setIsFilterOpen(false)} className="lg:hidden p-2 bg-white rounded-full shadow-sm text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                title: "Stream",
                                key: "stream",
                                options: ["Commerce & Banking", "Design", "Engineering", "Management", "Hotel Management"],
                            },
                            {
                                title: "Degree",
                                key: "degree",
                                options: ["B.Tech. ( Bachelor of Technology)", "M.Tech. ( Master of Technology)", "B.E. ( Bachelor of Engineering)", "MBA ( Master of Business Administration)", "BBA ( Bachelor of Business Administration)", "BCA ( Bachelor of Computer Applications)", "B.Sc. ( Bachelor of Science)", "M.Sc. ( Master of Science)", "B.Com. ( Bachelor of Commerce)", "M.Com. ( Master of Commerce)", "B.Arch. ( Bachelor of Architecture)", "M.Arch. ( Master of Architecture)", "Ph.D. (Doctor of Philosophy)", "M.D.S. ( Master of Dental Surgery)", "B.Pharm. ( Bachelor of Pharmacy)", "M.B.B.S. ( Bachelor of Medicine and Bachelor of Surgery)", "M.Pharm. ( Master of Pharmacy)", "B.H.M. ( Bachelor of Hotel Management)"],
                            },
                            {
                                title: "Cities",
                                key: "city",
                                options: ["Chennai", "Kanchipuram", "Tiruvallur", "Chengalpattu", "Pondicherry", "Trichy", "Coimbatore", "Salem", "Erode", "Madurai"],
                            }
                        ].map((block) => {
                            // FILTER LOGIC: Get the search term for this specific block
                            const searchTerm = localSearch[block.title]?.toLowerCase() || "";
                            const filteredOptions = block.options.filter(opt =>
                                opt.toLowerCase().includes(searchTerm)
                            );

                            return (
                                <div key={block.title} className="bg-white h-70 pt-0 p-5 rounded-xl overflow-y-scroll no-scrollbar shadow-sm border border-gray-100 lg:border-none">
                                    <div className='bg-white sticky top-0 py-5'>
                                        <h4 className="font-bold">{block.title}</h4>
                                        <div className="flex items-center gap-2 mt-2 border-b border-gray-100">
                                            <button className="text-gray-400">
                                                <Search size={16} />
                                            </button>
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="grow py-2 outline-none text-sm"
                                                // VALUE AND ONCHANGE: Update state for this block title
                                                value={localSearch[block.title] || ""}
                                                onChange={(e) => setLocalSearch({
                                                    ...localSearch,
                                                    [block.title]: e.target.value
                                                })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-700 mt-2">
                                        {/* MAP FILTERED OPTIONS INSTEAD OF BLOCK.OPTIONS */}
                                        {filteredOptions.length > 0 ? (
                                            filteredOptions.map((opt) => (
                                                <label key={opt} className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-3 accent-indigo-600 h-4 w-4"
                                                        checked={searchParams.get(block.key) === opt}
                                                        onChange={() => updateFilter(block.key, opt)}
                                                    />
                                                    <span className={searchParams.get(block.key) === opt ? "text-indigo-600 font-bold" : ""}>
                                                        {opt}
                                                    </span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-xs italic py-2">No matches found</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Mobile Apply Button */}
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full lg:hidden bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg mt-4"
                        >
                            Show Results
                        </button>
                    </div>

                </aside>


                {/* Results Section */}
                <section className="w-full lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">
                            Showing {initialColleges.length} Colleges
                        </h3>
                        <select
                            onChange={(e) => handleSort(e.target.value)}
                            className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="default">Sort by: Default</option>
                            <option value="fees_low">Fees: Low to High</option>
                            <option value="rank_low">NIRF Rank: High to Low</option>
                            <option value="package_high">Avg Package: High to Low</option>
                        </select>
                    </div>

                    {initialColleges.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                            <h3 className="text-xl font-semibold text-gray-600">No colleges found matching your criteria.</h3>
                            <button onClick={resetFilters} className="mt-4 text-indigo-600 font-medium cursor-pointer underline">
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        initialColleges.map((college) => (
                            <div key={college.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-6 flex flex-col lg:flex-row gap-3 md:gap-6">

                                {/* Left Side: Image Gallery Section */}
                                <div className="relative w-full lg:w-75 shrink-0">
                                    <div className="relative h-54 min-h-[80%] rounded-xl overflow-hidden mb-3 bg-gray-200">
                                        {/* <img
                                        src={college.banner_url || "https://via.placeholder.com/400x300"}
                                        className="w-full h-full object-cover"
                                        alt={college.name}
                                    /> */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent">
                                            <h4 className="text-white font-bold text-sm leading-tight">
                                                {college.name}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    <div className="grid grid-cols-4 gap-2 min-h-[20%]">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-15 rounded-lg overflow-hidden bg-gray-200 ">
                                                {/* <img src={college.banner_url || ""} className="w-full h-full object-cover opacity-80" alt="thumb" /> */}
                                            </div>
                                        ))}
                                        <div className="h-15 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold cursor-pointer">
                                            +more
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Content Section */}
                                <div className="flex-1 bg-white rounded-2xl p-0 md:p-0">
                                    {/* Logo and Tags - Hidden tags on very small mobile to match your HTML version */}
                                    <div className="flex justify-between items-center gap-3 mb-2">
                                        <div className="relative w-10 h-10 md:w-15 md:h-15 rounded-full shadow-sm bg-gray-200 flex items-center justify-center text-[10px] md:text-xs">
                                            <Image src={college.logo_url || "/placeholder-logo.svg"} width={60} height={60} alt="Logo" className='rounded-full' />
                                        </div>

                                        <div className="hidden sm:flex gap-2">
                                            <span className="bg-[#FFF3EC] text-[#D97706] px-2 md:px-3 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase">
                                                {college.ownership || 'Private'}
                                            </span>
                                            <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 md:px-3 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase">
                                                Multiple Programs Offered
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg md:text-2xl font-medium text-[#0F172A] mb-1">
                                        {college.name}
                                    </h3>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 md:mb-3 gap-2">
                                        <p className="text-gray-500 font-medium text-sm md:text-base">
                                            {college.city}
                                        </p>

                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="font-bold text-sm md:text-base">4.9</span>
                                            <span className="text-gray-400 text-xs md:text-sm">(1k reviews)</span>
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex gap-2 md:gap-3 mb-1 md:mb-2">
                                        <span className="bg-[#E8EFFF] text-[#2D5BFF] px-3 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-xs font-medium border border-[#2D5BFF]/10">
                                            NAAC {college.naac_grade || 'A++'}
                                        </span>
                                        <span className="bg-[#E7F9EE] text-[#059669] px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-xs font-medium border border-[#059669]/10">
                                            #{college.nirf_ranking} NIRF 2023
                                        </span>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="flex gap-1 md:gap-6 mb-4 md:mb-3 ">
                                        <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin className='w-4 h-4 text-blue-300' />
                                            <span className="text-xs md:text-sm md:font-medium">{college.city || 'Tamil Nadu'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                        <Globe className='w-4 h-4 text-blue-300' />
                                            <span className="text-xs md:text-sm md:font-medium">{college.website}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                        <Mail className='w-4 h-4 text-blue-300' />
                                            <span className="text-xs md:text-sm md:font-medium">{college.email || college.slug }</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="max-h-30 text-gray-600 text-xs md:text-sm mb-4 md:mb-3 overflow-y-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {college.description || "An MBA in Marketing is a postgraduate degree focusing on marketing strategies, brand management, and consumer behavior, equipping students with skills for roles like Brand Manager, Sales Manager, or Market Research Analyst..."}
                                    </p>
                                    <hr className="mb-4 md:mb-6 opacity-50" />
                                    <p className="text-[10px] md:text-xs text-gray-400 mb-4 font-medium">
                                        Know more about{' '}
                                        <span className="text-[#2D5BFF] cursor-pointer">
                                            Courses & Fees, Admissions, Placements, Facilities, Reviews
                                        </span>
                                    </p>

                                    {/* Footer Buttons */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-[#2D5BFF] mb-2 uppercase">Top Courses</p>
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-red-400"></div>
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-400"></div>
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-400"></div>
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold">+2</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button className="flex-1 sm:flex-none border-2 border-[#2D5BFF] text-[#2D5BFF] font-bold px-4 md:px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors text-xs md:text-sm">
                                                Apply now
                                            </button>
                                            <a href={`/colleges/${college.slug}`} className="flex-1 sm:flex-none bg-[#4F46E5] text-white font-bold px-4 md:px-6 py-2 rounded-lg shadow-md hover:bg-[#4338CA] transition-colors text-xs md:text-sm">View More</a>
                                            {/* <Link
                                                href={`/colleges/${college.slug}`}
                                                >
                                                <button className="flex-1 sm:flex-none bg-[#4F46E5] text-white font-bold px-4 md:px-6 py-2 rounded-lg shadow-md hover:bg-[#4338CA] transition-colors text-xs md:text-sm">
                                                View More
                                            </button>
                                            </Link> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
            <Footer />
            <EnquiryFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                sourcePage="College Listing"
                hiddenFields={hiddenFields}
            />
        </div>
    );
}
