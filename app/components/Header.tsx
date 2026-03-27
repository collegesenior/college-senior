'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import EnquiryFormModal from './EnquiryFormModal';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Colleges', href: '/colleges' },
    { name: 'Courses', href: '/courses' },
    { name: 'Updates', href: '/updates' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const getLinkStyle = (href: string) => {
    const isActive = pathname === href;
    return `px-3 py-2 transition font-medium  ${
      isActive 
        ? 'text-yellow-400 ' 
        : 'text-white  hover:text-yellow-400'
    }`;
  };

  return (
    <header className="max-w-387 mx-auto bg-[#0d68f2] sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-12 py-4 max-w-400 mx-auto">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/collegesenior logo B.svg" 
            alt="College Senior Logo" 
            width={200} 
            height={60} 
            className="w-auto h-10 md:h-12"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden min-[1300px]:flex space-x-6 text-lg">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={getLinkStyle(link.href)}>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons & Hamburger */}
        <div className="flex items-center space-x-4">
          <div className="hidden min-[1300px]:flex items-center space-x-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-white font-semibold border border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Apply to Enquiry
            </button>
            <Link href="/contact" className="px-6 py-2 bg-white text-[#0d68f2] rounded-md font-semibold hover:bg-gray-100 transition">
              Talk to Expert
            </Link>
          </div>

          <button 
            className="min-[1300px]:hidden text-white p-2 transition-transform duration-300 active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Animated Mobile/Tablet Drawer */}
      <div 
        className={`
          min-[1300px]:hidden bg-[#0d68f2] border-blue-400 absolute w-full left-0 overflow-hidden transition-all duration-500 ease-in-out
          ${isOpen 
            ? "max-h-150 opacity-100 py-8 visible" 
            : "max-h-0 opacity-0 py-0 invisible"}
        `}
      >
        <nav className="flex flex-col space-y-6 px-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={`text-xl ${getLinkStyle(link.href)} border-b-0 inline-block`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-blue-400" />
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 text-white border border-white rounded-lg font-bold"
            >
              Apply to Colleges
            </button>
            <Link 
              href="/contact" 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-white text-[#0d68f2] text-center rounded-lg font-bold"
            >
              Talk to Expert
            </Link>
          </div>
        </nav>
      </div>
      
      <EnquiryFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        sourcePage="Header - Apply to Colleges"
      />
    </header>
  );
}