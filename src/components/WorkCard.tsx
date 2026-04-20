import { motion } from 'motion/react';
import { Play, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export type AspectRatio = '16/9' | '9/16' | '4/5';

interface WorkCardProps {
  title: string;
  category: string;
  image: string;
  type: 'video' | 'image';
  description?: string;
  videoUrl?: string;
  aspectRatio?: AspectRatio;
  index: number;
  onClick?: () => void;
}

export default function WorkCard({ 
  title, 
  category, 
  image, 
  type, 
  description, 
  aspectRatio = '16/9', 
  index, 
  onClick 
}: WorkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      data-cursor={type === 'video' ? "PLAY" : "VIEW"}
      onClick={onClick}
      className={cn(
        "group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 cursor-pointer w-full flex items-center justify-center transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-white/20 h-[350px] md:h-[500px]"
      )}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-1000 group-hover:blur-0 blur-[2px]"
          referrerPolicy="no-referrer"
        />
        
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
        
        {/* Play/View Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500"
          >
            {type === 'video' ? (
              <Play fill="white" size={24} className="text-white ml-1" />
            ) : (
              <ImageIcon size={24} className="text-white" />
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 pointer-events-none text-left">
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-purple-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        >
          {category}
        </motion.p>
        <h3 className="text-xs md:text-2xl font-black uppercase tracking-tighter italic leading-none group-hover:text-glow transition-all duration-500">
          {title}
        </h3>
      </div>
      
      {/* Corner Accents */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}
