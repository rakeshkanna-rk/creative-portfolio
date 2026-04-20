import { motion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import { cn } from '../lib/utils';
import FunkyHeading from '../components/FunkyHeading';
import { SiBlender, SiCanva } from 'react-icons/si';
import { 
  Layers, Video, Image as ImageIcon, PenTool, Zap, Film, Palette, 
  Play, Code, Database, Globe, Cpu, Monitor, Smartphone 
} from 'lucide-react';

const skillIconMap: Record<string, any> = {
  SiBlender, SiCanva, Layers, Video, ImageIcon, PenTool, Zap, Film, Palette,
  Play, Code, Database, Globe, Cpu, Monitor, Smartphone
};

import { usePortfolioData } from '../hooks/usePortfolioData';

export default function About() {
  const { personalInfo, timeline, skills, loading } = usePortfolioData();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="pt-24 md:pt-40 pb-40 px-6 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-40 md:mb-60"
      >
        <FunkyHeading as="h1" className="text-[10vw] md:text-[9vw] mb-16 md:mb-24 leading-none">The Vision</FunkyHeading>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">
          <div className="md:col-span-7 space-y-10 md:space-y-16">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic leading-tight"
            >
              Crafting visual narratives that <span className="text-purple-500">resonate</span> and <span className="text-blue-500">inspire</span>.
            </motion.h2>
            
            <div className="space-y-8 text-lg md:text-2xl text-white/60 leading-relaxed font-light">
              <p>
                Hi, I’m {personalInfo.name} — a passionate freelance graphic designer and video editor with over 3 years of hands-on experience in crafting visually compelling and impactful digital content.
              </p>
              <p>
                I specialize in bringing ideas to life through creative design and engaging video storytelling. With strong expertise in industry-leading tools like Adobe Photoshop, Illustrator, After Effects, and Premiere Pro, along with a working knowledge of Blender, I deliver high-quality visuals that align perfectly with brand identity and audience expectations.
              </p>
              <p>
                My approach combines creativity with strategy — whether it’s designing eye-catching graphics, editing dynamic videos, or building a complete digital presence for brands. I focus on understanding each client’s vision and transforming it into powerful visual communication that stands out in today’s competitive digital space.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-5 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              className="relative aspect-3/4 rounded-3xl overflow-hidden border border-white/10 group shadow-2xl"
            >
              <img
                src="https://picsum.photos/seed/monishwar/800/1000"
                alt={personalInfo.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                <p className="text-purple-500 text-xs font-black uppercase tracking-widest mb-1">Based in</p>
                <p className="text-white text-xl font-bold uppercase tracking-tighter italic">Digital Space</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Cinematic Timeline */}
      <section ref={containerRef} className="relative py-20 md:py-40">
        <div className="flex flex-col items-center mb-32">
          <p className="text-purple-500 text-xs md:text-sm font-black uppercase tracking-[0.5em] mb-6">Experience</p>
          <FunkyHeading className="text-4xl md:text-8xl">The Journey</FunkyHeading>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Progress Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />
          <motion.div 
            style={{ scaleY }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-purple-500 via-blue-500 to-purple-500 origin-top -translate-x-1/2 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          />
          
          <div className="space-y-24 md:space-y-48">
            {timeline.map((item, i) => (
              <TimelineItem key={i} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Visualization - Core Arsenal */}
      <section className="mt-40 md:mt-60">
        <FunkyHeading className="text-3xl md:text-6xl mb-16 md:mb-20 text-center">Core Arsenal</FunkyHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 max-w-5xl mx-auto">
          {skills.map((skill, i) => {
            const Icon = typeof skill.icon === 'string' ? skillIconMap[skill.icon] : skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center group hover:bg-purple-500/10 transition-all duration-500"
              >
                <div className="relative mb-4 group-hover:scale-110 transition-transform duration-500">
                  {Icon && <Icon 
                    size={40} 
                    className="text-white/40 group-hover:text-white transition-colors duration-500"
                    style={{ filter: `drop-shadow(0 0 0px ${skill.color})` }}
                  />}
                <div 
                  className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"
                  style={{ backgroundColor: skill.color }}
                />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-[8px] md:text-[10px] text-white/40 group-hover:text-white transition-colors leading-tight">
                {skill.name}
              </h3>
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                {skill.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-purple-600" />
              </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TimelineItem({ year, title, desc, index }: { year: string; title: string; desc: string; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div className={cn("flex flex-col md:flex-row items-center justify-between w-full relative pl-16 md:pl-0", isEven ? "md:flex-row" : "md:flex-row-reverse")}>
      <div className="w-full md:w-[42%]">
        <motion.div
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/5 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-xl hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[80px] group-hover:bg-purple-500/20 transition-all duration-700" />
          
          <span className="text-purple-500 font-black text-2xl md:text-4xl italic mb-4 block tracking-tighter">{year}</span>
          <h3 className="text-xl md:text-3xl font-black mt-2 uppercase tracking-tighter italic leading-none">{title}</h3>
          <p className="text-white/40 text-sm md:text-lg mt-6 leading-relaxed font-light">{desc}</p>
          
          {/* Corner Accent */}
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/10 group-hover:border-purple-500/50 transition-colors duration-500" />
        </motion.div>
      </div>
      
      {/* Center Dot with Pulse */}
      <div className="absolute left-6 md:left-1/2 top-0 md:top-1/2 w-4 h-4 md:w-6 md:h-6 -translate-x-1/2 md:-translate-y-1/2 z-10">
        <div className="absolute inset-0 bg-purple-500 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.8)]" />
        <motion.div 
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-purple-500 rounded-full"
        />
      </div>
      
      <div className="hidden md:block w-[42%]" />
    </div>
  );
}


