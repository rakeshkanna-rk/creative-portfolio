import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface FunkyHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export default function FunkyHeading({ children, className, as: Component = 'h2' }: FunkyHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative group cursor-default perspective-1000 inline-block", className)}
    >
      <Component className="relative z-10 font-black uppercase tracking-tighter italic transition-all duration-700 group-hover:skew-x-[-8deg] group-hover:scale-[1.02] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
        {children}
      </Component>
      
      {/* Subtle Distortion Layer (Always slightly visible) */}
      <div className="absolute inset-0 z-0 text-purple-500/10 blur-[2px] pointer-events-none -skew-x-2 translate-x-px">
        <Component className="font-black uppercase tracking-tighter italic">
          {children}
        </Component>
      </div>

      {/* Glitch Effect on Hover */}
      <motion.div
        className="absolute inset-0 z-0 text-purple-500 opacity-0 group-hover:opacity-20 blur-[1px] pointer-events-none transition-opacity"
        animate={{
          x: [-2, 2, -1, 1, 0],
          y: [1, -1, 1, -1, 0],
        }}
        transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
      >
        <Component className="font-black uppercase tracking-tighter italic">
          {children}
        </Component>
      </motion.div>
    </motion.div>
  );
}
