import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Send } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import FunkyHeading from '../components/FunkyHeading';

import { usePortfolioData } from '../hooks/usePortfolioData';

export default function Contact() {
  const { personalInfo, loading } = usePortfolioData();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  if (loading) return null;

  return (
    <div className="pt-24 md:pt-40 pb-40 px-6 md:px-8 max-w-7xl mx-auto">
      <FunkyHeading as="h1" className="text-[10vw] md:text-[8vw] mb-16 md:mb-32 leading-none">The Contact</FunkyHeading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12 md:space-y-20"
        >
          <div className="space-y-6 md:space-y-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">Let's <span className="text-purple-500">Collaborate</span></h2>
            <p className="text-white/40 text-lg md:text-2xl leading-relaxed max-w-md font-light italic">
              Ready to elevate your visual presence? Let's build something cinematic together.
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            <div className="flex items-center gap-6 md:gap-8 group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-purple-600 transition-all duration-500 group-hover:rotate-12 group-hover:border-purple-500 shrink-0">
                <Mail className="text-purple-500 group-hover:text-white transition-colors" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-1">Direct Line</p>
                <p className="text-lg md:text-2xl font-bold tracking-tight">{personalInfo.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 md:gap-8 group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-purple-600 transition-all duration-500 group-hover:rotate-12 group-hover:border-purple-500 shrink-0">
                <MapPin className="text-purple-500 group-hover:text-white transition-colors" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-1">Location</p>
                <p className="text-lg md:text-2xl font-bold tracking-tight">{personalInfo.location}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -8, scale: 1.1, rotate: 5 }}
                className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-500 group"
              >
                <Icon size={20} className="group-hover:text-purple-500 transition-colors" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/5 p-8 md:p-14 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Background Accent */}
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/5 blur-[100px] pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.5em] text-white/20 ml-6">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-purple-500/50 transition-all duration-500 text-sm md:text-base font-light italic"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.5em] text-white/20 ml-6">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-purple-500/50 transition-all duration-500 text-sm md:text-base font-light italic"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.5em] text-white/20 ml-6">Message</label>
              <textarea
                required
                rows={4}
                className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-6 focus:outline-none focus:border-purple-500/50 transition-all duration-500 resize-none text-sm md:text-base font-light italic"
                placeholder="Tell me about your vision..."
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-700 text-xs md:text-base shadow-2xl",
                isSubmitted ? "bg-green-500 text-white" : "bg-white text-black hover:bg-purple-600 hover:text-white"
              )}
            >
              {isSubmitted ? "Message Sent!" : (
                <>
                  Initiate Project <Send size={20} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
