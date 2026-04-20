import { useState } from 'react';
import FunkyHeading from '../components/FunkyHeading';
import WorkCard from '../components/WorkCard';
import ProjectModal from '../components/ProjectModal';

import { AspectRatio } from '../components/WorkCard';

import { usePortfolioData } from '../hooks/usePortfolioData';
import { Project } from '../data/webData';

export default function Work() {
  const { projects, loading } = usePortfolioData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const motionGraphics = projects.filter(p => p.category === 'Motion Graphics');
  const videoEditing = projects.filter(p => p.category === 'Video Editing');
  const graphicDesign = projects.filter(p => p.category === 'Graphic Design');

  if (loading) return null;

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
      <FunkyHeading as="h1" className="text-[10vw] md:text-[8vw] mb-16 md:mb-32">The Showcase</FunkyHeading>

      <div className="space-y-32 md:space-y-60">
        {/* Motion Graphics Section */}
        <section className="space-y-12 md:space-y-20">
          <div className="flex items-end justify-between border-b border-white/10 pb-8">
            <FunkyHeading className="text-4xl md:text-7xl">Motion Graphics</FunkyHeading>
            <span className="text-white/20 text-xs md:text-sm font-mono uppercase tracking-widest hidden md:block">Section 01 / Motion</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-9">
              <WorkCard 
                index={0} 
                {...motionGraphics[0]} 
                onClick={() => handleProjectClick(motionGraphics[0])}
              />
            </div>
            <div className="md:col-span-3">
              <WorkCard 
                index={1} 
                {...motionGraphics[1]} 
                onClick={() => handleProjectClick(motionGraphics[1])}
              />
            </div>
            <div className="md:col-span-3">
              <WorkCard 
                index={2} 
                {...motionGraphics[2]} 
                onClick={() => handleProjectClick(motionGraphics[2])}
              />
            </div>
            <div className="md:col-span-9 bg-white/5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center p-10 h-[350px] md:h-[500px]">
              <p className="text-white/20 text-sm font-mono uppercase tracking-[0.3em] text-center">More Motion Projects Coming Soon</p>
            </div>
          </div>
        </section>

        {/* Video Editing Section */}
        <section className="space-y-12 md:space-y-20">
          <div className="flex items-end justify-between border-b border-white/10 pb-8">
            <FunkyHeading className="text-4xl md:text-7xl">Video Editing</FunkyHeading>
            <span className="text-white/20 text-xs md:text-sm font-mono uppercase tracking-widest hidden md:block">Section 02 / Editing</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-3">
              <WorkCard 
                index={0} 
                {...videoEditing[1]} 
                onClick={() => handleProjectClick(videoEditing[1])}
              />
            </div>
            <div className="md:col-span-9">
              <WorkCard 
                index={1} 
                {...videoEditing[0]} 
                onClick={() => handleProjectClick(videoEditing[0])}
              />
            </div>
            <div className="md:col-span-12">
              <WorkCard 
                index={2} 
                {...videoEditing[2]} 
                onClick={() => handleProjectClick(videoEditing[2])}
              />
            </div>
          </div>
        </section>

        {/* Graphic Design Section */}
        <section className="space-y-12 md:space-y-20">
          <div className="flex items-end justify-between border-b border-white/10 pb-8">
            <FunkyHeading className="text-4xl md:text-7xl">Graphic Design</FunkyHeading>
            <span className="text-white/20 text-xs md:text-sm font-mono uppercase tracking-widest hidden md:block">Section 03 / Design</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {graphicDesign.map((project, i) => (
              <WorkCard 
                key={project.id} 
                index={i} 
                {...project} 
                aspectRatio="4/5"
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        </section>
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
