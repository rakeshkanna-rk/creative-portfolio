import { motion, useScroll, useTransform } from 'motion/react';
import React, { useRef, useState, Fragment } from 'react';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import FunkyHeading from '../components/FunkyHeading';
import WorkCard from '../components/WorkCard';
import ProjectModal from '../components/ProjectModal';

import { usePortfolioData } from '../hooks/usePortfolioData';
import { Project } from '../data/webData';

export default function Home() {
  const { personalInfo, projects, loading } = usePortfolioData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const motionProjects = projects.filter(p => p.category === 'Motion Graphics').slice(0, 2);
  const videoProjects = projects.filter(p => p.category === 'Video Editing').slice(0, 2);
  const designProjects = projects.filter(p => p.category === 'Graphic Design').slice(0, 3);

  return (
    <div ref={containerRef} className="relative">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="text-white/20 uppercase tracking-[0.5em] text-xs animate-pulse">Initializing Reality...</div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="text-center z-10 px-6 md:px-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="perspective-1000 relative"
          >
            {/* Cinematic Light Sweep */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              className="absolute inset-0 z-20 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
            />
            
            <FunkyHeading 
              as="h1" 
              className="text-[7vw] md:text-[6vw] leading-none mb-4 text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.3)] skew-x-[-5deg]"
            >
              {personalInfo.name}
            </FunkyHeading>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[8px] md:text-sm font-bold tracking-[0.4em] uppercase text-white/60"
          >
            {personalInfo.role.split(' • ').map((role, i, arr) => (
              <Fragment key={role}>
                <span>{role}</span>
                {i < arr.length - 1 && <span className="w-1 h-1 bg-purple-500 rounded-full" />}
              </Fragment>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-16 md:mt-20"
          >
            <Link
              to="/work"
              data-cursor="WORKS"
              className="group relative px-10 md:px-14 py-4 md:py-5 overflow-hidden rounded-full transition-all duration-500"
            >
              <div className="absolute inset-0 bg-white group-hover:bg-purple-600 transition-colors duration-500" />
              <span className="relative z-10 text-black group-hover:text-white font-black uppercase tracking-widest text-xs md:text-base">
                View Showcase
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20"
        >
          <ArrowDown size={20} />
        </motion.div>
      </section>

      {/* Featured Categories Preview */}
      <section className="py-20 md:py-40 px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-24 md:space-y-40">
          
          {/* Motion Graphics Preview */}
          <div className="space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <FunkyHeading className="text-3xl md:text-6xl">Motion Graphics</FunkyHeading>
              <Link to="/work" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 hover:text-purple-500 transition-colors">View All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              <div className="md:col-span-9">
                <WorkCard 
                  index={1} 
                  {...motionProjects[0]}
                  onClick={() => handleProjectClick(motionProjects[0])}
                />
              </div>
              <div className="md:col-span-3">
                <WorkCard 
                  index={2} 
                  {...motionProjects[1]}
                  onClick={() => handleProjectClick(motionProjects[1])}
                />
              </div>
            </div>
          </div>

          {/* Video Editing Preview */}
          <div className="space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <FunkyHeading className="text-3xl md:text-6xl">Video Editing</FunkyHeading>
              <Link to="/work" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 hover:text-purple-500 transition-colors">View All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              <div className="md:col-span-3">
                <WorkCard 
                  index={1} 
                  {...videoProjects[1]}
                  onClick={() => handleProjectClick(videoProjects[1])}
                />
              </div>
              <div className="md:col-span-9">
                <WorkCard 
                  index={2} 
                  {...videoProjects[0]}
                  onClick={() => handleProjectClick(videoProjects[0])}
                />
              </div>
            </div>
          </div>

          {/* Graphic Design Preview */}
          <div className="space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <FunkyHeading className="text-3xl md:text-6xl">Graphic Design</FunkyHeading>
              <Link to="/work" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 hover:text-purple-500 transition-colors">View All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {designProjects.map((project, i) => (
                <WorkCard 
                  key={project.id}
                  index={i} 
                  {...project}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-60 px-6 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-500/5 blur-[120px] rounded-full scale-150 -z-10" />
        <FunkyHeading className="text-4xl md:text-8xl mb-12">Let's Create</FunkyHeading>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            to="/contact"
            data-cursor="HIRE"
            className="px-10 md:px-16 py-5 md:py-6 border border-white/10 rounded-full text-sm md:text-xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500"
          >
            Start a Project
          </Link>
        </motion.div>
      </section>
        </>
      )}

      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
