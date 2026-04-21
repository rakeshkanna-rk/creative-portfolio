import { motion } from 'motion/react';
import { SiBlender, SiCanva, SiFigma, SiDavinciresolve, SiGithub } from 'react-icons/si';
import { 
  Video, Film, Zap, Layers, Palette, Play, 
  Code, Database, Globe, Cpu, Monitor, Smartphone, PenTool, Image as ImageIcon, Search,
  Wand2, Sparkles, Camera, Scissors, Frame
} from 'lucide-react';
import { cn } from '../lib/utils';
import FunkyHeading from '../components/FunkyHeading';

import { usePortfolioData } from '../hooks/usePortfolioData';

const iconMap: Record<string, any> = {
  Video, Film, Zap, Layers, Palette, Play,
  Code, Database, Globe, Cpu, Monitor, Smartphone, PenTool, ImageIcon, Search,
  Wand2, Sparkles, Camera, Scissors, Frame,
  SiBlender, SiCanva, SiFigma, SiDavinciresolve, SiGithub
};

export default function Services() {
  const { services, loading } = usePortfolioData();

  if (loading) return null;

  return (
    <div className="pt-24 md:pt-40 pb-40 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-20 md:mb-40 gap-8">
        <FunkyHeading as="h1" className="text-[10vw] md:text-[8vw] leading-none">The Craft</FunkyHeading>
        <p className="text-white/40 text-sm md:text-xl max-w-sm font-light italic leading-relaxed">
          Specialized creative solutions tailored for high-end brands and cinematic storytelling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {services.map((service, i) => {
          const iconName = service.icon;
          const isCustomUrl = typeof iconName === 'string' && iconName.startsWith('http');
          const Icon = !isCustomUrl && typeof iconName === 'string' ? iconMap[iconName] : (typeof iconName !== 'string' ? iconName : null);
          
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative p-10 md:p-14 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-xl hover:bg-purple-500/5 transition-all duration-700 overflow-hidden flex flex-col h-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-white/20"
            >
              {/* Background Icon Accent */}
              <div className="absolute -top-10 -right-10 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none group-hover:scale-110 transform origin-center">
                {isCustomUrl ? (
                  <img src={iconName} alt="" className="w-48 h-48 object-contain grayscale invert" />
                ) : Icon && <Icon size={200} strokeWidth={0.5} />}
              </div>
              
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-10 md:mb-14 group-hover:bg-purple-600 transition-all duration-500 group-hover:rotate-10 border border-white/10 group-hover:border-purple-500 shadow-xl overflow-hidden p-4">
                {isCustomUrl ? (
                  <img src={iconName} alt={service.title} className="w-full h-full object-contain brightness-0 invert group-hover:scale-110 transition-transform duration-500" />
                ) : Icon && <Icon className="text-white group-hover:scale-110 transition-transform duration-500" size={32} strokeWidth={1.5} />}
              </div>

            <h3 className="text-2xl md:text-4xl font-black uppercase mb-6 tracking-tighter italic leading-none group-hover:text-glow transition-all duration-500">{service.title}</h3>
            <p className="text-white/40 leading-relaxed mb-10 text-sm md:text-lg font-light italic">
              {service.description}
            </p>

            <div className="mt-auto pt-10 border-t border-white/5">
              <ul className="grid grid-cols-1 gap-4">
                {service.features.map((feature, idx) => (
                  <motion.li 
                    key={feature} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i * 0.1) + (idx * 0.05) }}
                    className="flex items-center gap-4 text-xs md:text-sm text-white/60 group-hover:text-white/90 transition-colors duration-500"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500/50 group-hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] shrink-0" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Corner Accent */}
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-linear-to-br from-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>
            );
        })}
      </div>
    </div>
  );
}
