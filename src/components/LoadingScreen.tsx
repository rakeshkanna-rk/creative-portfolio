import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    >
      <div className="relative">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-black tracking-tighter uppercase italic"
        >
          MONISH<span className="text-purple-500">.</span>
        </motion.h1>
        <motion.div
          animate={{ x: [-2, 2, -2], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.1, repeat: Infinity }}
          className="absolute top-0 left-0 text-red-500 opacity-50 blur-[2px] pointer-events-none"
        >
          MONISH.
        </motion.div>
      </div>
      
      <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-purple-500"
        />
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-[0.5em] text-white/40">
        Loading {progress}%
      </span>
    </motion.div>
  );
}
