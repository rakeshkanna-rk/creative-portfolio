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
  videoUrl?: string;
  aspectRatio?: AspectRatio;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = project.videoUrl ? getYouTubeId(project.videoUrl) : null;
  const ratio = project.aspectRatio || '16/9';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className={cn(
              "relative w-full bg-zinc-900 rounded-4xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10",
              ratio === '16/9' && "max-w-7xl aspect-video",
              ratio === '9/16' && "max-w-md aspect-9/16 h-[90vh]",
              ratio === '4/5' && "max-w-lg aspect-4/5 h-[90vh]"
            )}
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-3 bg-black/50 hover:bg-purple-600 text-white rounded-full transition-all duration-500 z-20 group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
              <div className={cn(
                "w-full h-full flex items-center justify-center transition-all duration-700",
                ratio === '16/9' && "aspect-video",
                ratio === '9/16' && "aspect-9/16",
                ratio === '4/5' && "aspect-4/5"
              )}>
                {project.type === 'video' && youtubeId ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1&disablekb=0&fs=1&iv_load_policy=3&showinfo=0`}
                      title={project.title}
                      className="w-full h-full border-0 rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-contain rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              
              {/* Cinematic Vignette on Video */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(0,0,0,0.4)_100%)]" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
