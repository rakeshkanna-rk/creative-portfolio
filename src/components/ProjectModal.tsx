import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { AspectRatio } from './WorkCard';

interface Project {
  title: string;
  category: string;
  image: string;
  type: 'video' | 'image';
  description?: string;
  video_url?: string;
  aspect_ratio?: AspectRatio;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!project) return null;

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = project.video_url ? getYouTubeId(project.video_url) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 150 }}
            className="relative w-[80vw] h-[90vh] bg-[#050505] rounded-4xl md:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] z-10 flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 bg-black/60 hover:bg-purple-600 text-white rounded-full transition-all duration-500 z-50 group border border-white/10"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="flex-1 w-full relative flex flex-col md:flex-row overflow-hidden">
              {/* Media Section */}
              <div className="w-full md:w-[70%] h-[40vh] md:h-full relative bg-black flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                {/* Background Thumbnail Blur */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={project.image} 
                    alt="" 
                    className="w-full h-full object-cover opacity-20 blur-2xl transition-opacity duration-1000"
                  />
                </div>

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  {project.type === 'video' && project.video_url ? (
                    youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                        title={project.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={project.video_url}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    )
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="w-full md:w-[30%] flex flex-col bg-[#080808] relative z-20">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                  <div className="space-y-8">
                    <div>
                      <p className="text-purple-500 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mb-4">
                        {project.category}
                      </p>
                      <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-white leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    {project.description && (
                      <div className="space-y-4">
                        <div className="w-12 h-1 bg-purple-600 rounded-full opacity-50" />
                        <p className="text-white/60 text-sm md:text-base font-light leading-relaxed italic">
                          {project.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Logo/Brand area if needed */}
                <div className="p-8 border-t border-white/5 opacity-20 hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-[1em]">MONISH</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
