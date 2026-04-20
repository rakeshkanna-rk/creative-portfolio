import { motion } from 'motion/react';
import { Play, Layers, Activity, GanttChart, PenTool, MousePointer2 } from 'lucide-react';

const PassionElement = ({ icon: Icon, delay, x, y, size }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.02, 0.05, 0.02],
      scale: [1, 1.1, 1],
      x: [0, 20, 0],
      y: [0, -20, 0],
      rotate: [0, 15, 0]
    }}
    transition={{ 
      duration: 15 + Math.random() * 10,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none text-white/20"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <Icon size={size} strokeWidth={0.3} />
  </motion.div>
);

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0a] overflow-hidden">
      {/* Film Grain */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      
      {/* Cinematic Spotlight */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.4)_0%,transparent_60%)]" 
      />

      {/* Secondary Accent Light */}
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          x: [-50, 50, -50]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_60%,rgba(59,130,246,0.2)_0%,transparent_50%)]" 
      />

      {/* Deep Vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.8)_100%)]" />

      {/* Passion Elements - Motion & Film Markers */}
      <PassionElement icon={Play} x={15} y={25} size={40} delay={0} />
      <PassionElement icon={Layers} x={80} y={20} size={70} delay={2} />
      <PassionElement icon={Activity} x={20} y={70} size={50} delay={4} />
      <PassionElement icon={GanttChart} x={75} y={75} size={55} delay={1} />
      <PassionElement icon={PenTool} x={50} y={5} size={35} delay={3} />
      <PassionElement icon={MousePointer2} x={8} y={50} size={40} delay={5} />
      <PassionElement icon={Activity} x={92} y={45} size={45} delay={1.5} />
      <PassionElement icon={GanttChart} x={35} y={85} size={40} delay={2.5} />
      <PassionElement icon={Play} x={65} y={35} size={30} delay={4.5} />
      
      {/* Frame Grid Overlay (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
    </div>
  );
}
