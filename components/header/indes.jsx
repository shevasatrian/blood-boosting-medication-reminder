import { useState, useEffect } from 'react';
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Image from 'next/image'

export default function Header() {
    const router = useRouter();

    const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove('user_token');
    router.push('/login');
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-slate-800">
          <Image src="/icon.png" width={50} height={50} />
        </div>
        <div className="flex items-center">
          <Link href='/reminder' >
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                Tandai Kalender
            </div>
          </Link>
          <button onClick={handleLogout} className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );

}