import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight } from 'lucide-react';
import FunkyHeading from './FunkyHeading';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { getIcon } from '../lib/icons';

export default function Footer() {
  const { personalInfo, socialLinks } = usePortfolioData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-20 pb-10 px-6 md:px-8 border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20 mb-20">
          {/* Logo & Vision */}
          <div className="md:col-span-5 space-y-8">
            <FunkyHeading className="text-3xl md:text-5xl">{personalInfo.name}</FunkyHeading>
            <p className="text-white/40 text-lg md:text-xl font-light italic max-w-sm">
              {personalInfo.footer_text}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link: any) => {
                const Icon = getIcon(link.icon_name || link.icon);
                return (
                  <motion.a
                    key={link.id || link.name}
                    href={link.url || link.href}
                    whileHover={{ y: -5, scale: 1.1 }}
                    className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-500"
                  >
                    <Icon size={20} className="text-white/60 hover:text-purple-500 transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Navigation</h4>
            <div className="flex flex-col gap-4">
              {['Home', 'Work', 'About', 'Services', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-white/60 hover:text-white transition-colors text-lg font-bold uppercase tracking-tighter italic group flex items-center gap-2"
                >
                  {item}
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4 space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Connect</h4>
            <div className="space-y-6">
              <a href={`mailto:${personalInfo.email}`} className="group block">
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Email</p>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-purple-500" />
                  <span className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-purple-500 transition-colors">{personalInfo.email}</span>
                </div>
              </a>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Availability</p>
                <p className="text-white font-bold flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  {personalInfo.availability}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] font-mono uppercase tracking-[0.5em]">
            © {currentYear} Monishwar. Visual Artist.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-widest">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
