import { Video, Film, Zap, Layers, Palette, Play, Image as ImageIcon, PenTool } from 'lucide-react';
import { SiBlender, SiCanva } from 'react-icons/si';

export type AspectRatio = '16/9' | '9/16' | '4/5';

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  type: 'video' | 'image';
  description?: string;
  videoUrl?: string;
  aspectRatio?: AspectRatio;
}

export interface Service {
  title: string;
  icon: any;
  description: string;
  features: string[];
}

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

export interface Skill {
  name: string;
  icon: any;
  color: string;
}

export const PERSONAL_INFO = {
  name: 'Monishwar',
  role: 'Motion Designer • Video Editor • Visual Creator',
  email: 'hello@monishwar.design',
  availability: 'Open for new projects',
  footer_text: 'Designed & Developed with Passion',
  bio: ''
};

export const PROJECTS: Project[] = [
  { 
    id: 1, 
    title: 'Neon Pulse', 
    category: 'Motion Graphics', 
    image: 'https://picsum.photos/seed/neon/800/600', 
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aspectRatio: '16/9',
    description: 'A high-energy neon motion piece exploring the intersection of light and sound in a digital void.'
  },
  { 
    id: 2, 
    title: 'Cyber Flow', 
    category: 'Motion Graphics', 
    image: 'https://picsum.photos/seed/cyber/800/600', 
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aspectRatio: '9/16',
    description: 'Fluid simulations and futuristic aesthetics combined to create a mesmerizing cybernetic journey.'
  },
  { 
    id: 3, 
    title: 'Abstract Void', 
    category: 'Motion Graphics', 
    image: 'https://picsum.photos/seed/void/800/600', 
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aspectRatio: '4/5',
    description: 'An exploration of abstract forms and textures, creating a sense of infinite depth and mystery.'
  },
  { 
    id: 4, 
    title: 'Urban Rhythm', 
    category: 'Video Editing', 
    image: 'https://picsum.photos/seed/urban/800/600', 
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aspectRatio: '16/9',
    description: 'Fast-paced urban storytelling that captures the heartbeat of the city through rhythmic editing.'
  },
  { 
    id: 5, 
    title: 'Cinematic Soul', 
    category: 'Video Editing', 
    image: 'https://picsum.photos/seed/soul/800/600', 
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aspectRatio: '9/16',
    description: 'A deep dive into emotional narrative editing, focusing on the subtle moments that tell a larger story.'
  },
  { 
    id: 6, 
    title: 'Digital Flow', 
    category: 'Video Editing', 
    image: 'https://picsum.photos/seed/flow/800/600', 
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aspectRatio: '4/5',
    description: 'Merging digital effects with live-action footage to create a seamless and engaging visual experience.'
  },
  { 
    id: 7, 
    title: 'Minimalist Brand', 
    category: 'Graphic Design', 
    image: 'https://picsum.photos/seed/brand/800/800', 
    type: 'image',
    aspectRatio: '4/5',
    description: 'A clean and modern brand identity project focusing on negative space and bold typography.'
  },
  { 
    id: 8, 
    title: 'Poster Series', 
    category: 'Graphic Design', 
    image: 'https://picsum.photos/seed/poster/800/800', 
    type: 'image',
    aspectRatio: '4/5',
    description: 'An experimental poster series exploring the relationship between digital textures and organic forms.'
  },
  { 
    id: 9, 
    title: 'Digital Identity', 
    category: 'Graphic Design', 
    image: 'https://picsum.photos/seed/id/800/800', 
    type: 'image',
    aspectRatio: '4/5',
    description: 'Comprehensive digital identity design for a tech-forward startup, including UI elements and social assets.'
  },
  { 
    id: 10, 
    title: 'Typography Study', 
    category: 'Graphic Design', 
    image: 'https://picsum.photos/seed/typo/800/800', 
    type: 'image',
    aspectRatio: '4/5',
    description: 'An in-depth study of typography as a primary visual element, pushing the boundaries of legibility and form.'
  },
];

export const SERVICES: Service[] = [
  {
    title: 'Video Editing',
    icon: Video,
    description: 'Cinematic video editing with a focus on rhythm, pacing, and emotional impact for commercials and films.',
    features: ['Color Grading', 'Sound Design', 'Narrative Editing', 'Multi-cam Editing']
  },
  {
    title: 'B Roll Reels',
    icon: Play,
    description: 'Dynamic and engaging short-form content optimized for social media platforms like Instagram and TikTok.',
    features: ['Fast-paced Cuts', 'Trending Audio Sync', 'Visual Hooks', 'Engagement Focused']
  },
  {
    title: 'Title Animations',
    icon: Layers,
    description: 'Professional typography and title design that adds a premium feel to your video productions.',
    features: ['Custom Typography', 'Lower Thirds', 'Intro/Outro Titles', 'Kinetic Type']
  },
  {
    title: 'Short Films',
    icon: Film,
    description: 'End-to-end post-production for short films, ensuring your story is told with cinematic excellence.',
    features: ['Storytelling Focus', 'VFX Integration', 'Pacing & Flow', 'Final Delivery']
  },
  {
    title: 'Motion Graphics',
    icon: Zap,
    description: 'Dynamic visual storytelling through high-end animation and motion design for brands and digital platforms.',
    features: ['Logo Animation', 'Explainer Videos', 'Social Media Content', 'Broadcast Graphics']
  },
  {
    title: 'Graphic Design',
    icon: Palette,
    description: 'Bold and impactful graphic design that defines your brand identity and visual language.',
    features: ['Brand Identity', 'Typography', 'Poster Design', 'Digital Assets']
  }
];

export const TIMELINE: TimelineItem[] = [
  { year: '2024', title: 'Senior Motion Designer', desc: 'Leading creative direction for high-impact brand campaigns and cinematic motion projects.' },
  { year: '2022', title: 'Visual Artist', desc: 'Explored the intersection of digital art and commercial video editing, refining a unique visual style.' },
  { year: '2020', title: 'Motion Graphics Intern', desc: 'Started the journey into the world of keyframes and easing, learning the foundations of storytelling.' },
  { year: '2018', title: 'Graphic Design Student', desc: 'Mastering the principles of typography, color theory, and composition.' },
];

export const SKILLS: Skill[] = [
  { name: 'Adobe Photoshop', icon: ImageIcon, color: '#31A8FF' },
  { name: 'Adobe After Effects', icon: Layers, color: '#9999FF' },
  { name: 'Adobe Illustrator', icon: PenTool, color: '#FF9A00' },
  { name: 'Adobe Premiere Pro', icon: Video, color: '#9999FF' },
  { name: 'Blender (Basics)', icon: SiBlender, color: '#EA7600' },
  { name: 'Canva', icon: SiCanva, color: '#00C4CC' },
];
