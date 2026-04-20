import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform } from 'motion/react';
import ThreeBackground from './ThreeBackground';
import Cursor from './Cursor';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  const { pathname } = useLocation();

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  const isAdminPath = pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen text-white selection:bg-purple-500 selection:text-white">
      {!isAdminPath && <ThreeBackground />}
      <Cursor />
      {!isAdminPath && <Navbar />}
      <main>{children}</main>
      {!isAdminPath && <Footer />}
    </div>
  );
}
