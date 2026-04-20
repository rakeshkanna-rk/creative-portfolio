import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  Briefcase, 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  LogOut,
  Image as ImageIcon,
  LogOut as LogOutIcon,
  ChevronRight,
  Video,
  Zap,
  Clock,
  Palette,
  Film,
  Play,
  Layers,
  PenTool,
  Code,
  Database,
  Globe,
  Cpu,
  Monitor,
  Smartphone,
  Check
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project' | 'service' | 'skill' | 'timeline' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [personalInfo, setPersonalInfo] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchAllData();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) navigate('/admin/login');
  }

  async function fetchAllData() {
    setLoading(true);
    try {
      const { data: info } = await supabase.from('personal_info').select('*').single();
      if (info) setPersonalInfo(info);

      const { data: proj } = await supabase.from('projects').select('*').order('order_index');
      if (proj) setProjects(proj);

      const { data: serv } = await supabase.from('services').select('*').order('order_index');
      if (serv) setServices(serv);

      const { data: skil } = await supabase.from('skills').select('*').order('order_index');
      if (skil) setSkills(skil);

      const { data: time } = await supabase.from('timeline').select('*').order('order_index');
      if (time) setTimeline(time);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updates = Object.fromEntries(formData.entries());
    
    try {
      const dataToUpsert = personalInfo?.id ? { id: personalInfo.id, ...updates } : updates;
      const { error } = await supabase
        .from('personal_info')
        .upsert(dataToUpsert);
      
      if (error) throw error;
      toast.success('Identity Unified');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Permanent deletion authorized?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      toast.success('Fragment Deleted');
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('order_index');
    if (data) setProjects(data);
  }

  const handleOpenModal = (type: any, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Cleanup non-schema fields
    delete data.color_text;
    delete data.hex_display;
    delete data.color_hex;

    // Handle array for services features
    if (modalType === 'service' && data.features) {
       data.features = (data.features as string).split(',').map(f => f.trim()) as any;
    }

    try {
      const tableMap: Record<string, string> = {
        project: 'projects',
        service: 'services',
        skill: 'skills',
        timeline: 'timeline'
      };

      const table = tableMap[modalType!];
      const { error } = await supabase
        .from(table)
        .upsert(editingItem?.id ? { id: editingItem.id, ...data } : data);

      if (error) throw error;
      toast.success('Reality Branch Merged');
      setIsModalOpen(false);
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (table: string, id: number) => {
    if (!confirm('Permanent deletion authorized?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Fragment Deleted');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const AVAILABLE_ICONS = [
    { name: 'Video', icon: Video },
    { name: 'Zap', icon: Zap },
    { name: 'Layers', icon: Layers },
    { name: 'Film', icon: Film },
    { name: 'Palette', icon: Palette },
    { name: 'Play', icon: Play },
    { name: 'PenTool', icon: PenTool },
    { name: 'ImageIcon', icon: ImageIcon },
    { name: 'Code', icon: Code },
    { name: 'Database', icon: Database },
    { name: 'Globe', icon: Globe },
    { name: 'Cpu', icon: Cpu },
    { name: 'Monitor', icon: Monitor },
    { name: 'Smartphone', icon: Smartphone }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-black p-8 flex flex-col fixed h-full z-50">
        <div className="mb-12">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-purple-500">Portfolio OS</h1>
          <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold mt-1">Management Hub</p>
        </div>

        <nav className="space-y-4 flex-1">
          {[
            { id: 'projects', label: 'Showcase', icon: Briefcase },
            { id: 'info', label: 'Identity', icon: LayoutDashboard },
            { id: 'services', label: 'The Craft', icon: Settings },
            { id: 'skills', label: 'The Talents', icon: Zap },
            { id: 'timeline', label: 'The Journey', icon: Clock },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 group ${
                activeTab === item.id 
                  ? 'bg-purple-600 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
                  : 'bg-white/5 border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-white/40 group-hover:text-white'} />
                <span className={`text-sm font-black uppercase tracking-widest ${activeTab === item.id ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                  {item.label}
                </span>
              </div>
              <ChevronRight size={16} className={activeTab === item.id ? 'text-white' : 'opacity-0'} />
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="p-4 bg-white/5 rounded-2xl border border-transparent hover:border-red-500/50 hover:bg-red-500/10 transition-all flex items-center gap-4 text-white/40 hover:text-red-500 mt-auto"
        >
          <LogOutIcon size={20} />
          <span className="text-sm font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-80 flex-1 p-12 bg-[#050505]">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter italic">
              {activeTab === 'projects' && 'The Showcase'}
              {activeTab === 'info' && 'The Identity'}
              {activeTab === 'services' && 'The Craft'}
              {activeTab === 'skills' && 'The Talents'}
              {activeTab === 'timeline' && 'The Journey'}
            </h2>
            <p className="text-white/20 text-xs uppercase tracking-[0.5em] mt-2">Manage your visual reality</p>
          </div>

          {activeTab === 'projects' && (
            <button 
              onClick={() => handleOpenModal('project')}
              className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all shadow-xl"
            >
              <Plus size={16} /> New Fragment
            </button>
          )}
          {activeTab === 'services' && (
            <button 
              onClick={() => handleOpenModal('service')}
              className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all shadow-xl"
            >
              <Plus size={16} /> New Craft
            </button>
          )}
          {activeTab === 'skills' && (
            <button 
              onClick={() => handleOpenModal('skill')}
              className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all shadow-xl"
            >
              <Plus size={16} /> New Talent
            </button>
          )}
          {activeTab === 'timeline' && (
            <button 
              onClick={() => handleOpenModal('timeline')}
              className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all shadow-xl"
            >
              <Plus size={16} /> New Milestone
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.length > 0 ? projects.map((project) => (
                <div key={project.id} className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden group hover:border-purple-500/30 transition-all">
                  <div className="aspect-video relative overflow-hidden bg-zinc-900">
                    <img 
                      src={project.image} 
                      alt="" 
                      className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      {project.type === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-purple-500 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                    <h3 className="text-lg font-bold uppercase tracking-tight">{project.title}</h3>
                    <div className="flex gap-4 mt-6">
                      <button 
                        onClick={() => handleOpenModal('project', project)}
                        className="flex-1 bg-white/5 hover:bg-white hover:text-black py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteItem('projects', project.id)}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                  <p className="text-white/20 uppercase tracking-[0.3em] text-xs">No fragments found in the void</p>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'info' && (
             <motion.form
               key="info"
               onSubmit={handleSaveIdentity}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="max-w-3xl space-y-12"
             >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Full Moniker</label>
                    <input name="name" className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10" defaultValue={personalInfo?.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Designation</label>
                    <input name="role" className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10" defaultValue={personalInfo?.role} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Hero Heading</label>
                    <input name="hero_title" className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10" defaultValue={personalInfo?.hero_title} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Hero Subheading</label>
                    <input name="hero_subtitle" className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10" defaultValue={personalInfo?.hero_subtitle} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Email Address</label>
                    <input name="email" className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10" defaultValue={personalInfo?.email} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Location</label>
                    <input name="location" className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10" defaultValue={personalInfo?.location} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Availability</label>
                    <input name="availability" className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10" defaultValue={personalInfo?.availability} />
                  </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">The Vision Statement</label>
                   <textarea name="vision_statement" rows={4} className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10 resize-none" defaultValue={personalInfo?.vision_statement} />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Footer Text</label>
                   <input name="footer_text" className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10" defaultValue={personalInfo?.footer_text} />
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className="bg-purple-600 px-10 py-5 rounded-full flex items-center gap-3 font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-50">
                    <Save size={20} /> {loading ? 'Transcending...' : 'Update Reality'}
                  </button>
                </div>
             </motion.form>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {services.map((service) => (
                <div key={service.id} className="bg-white/5 p-8 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-purple-500">
                      <Settings size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tight">{service.title}</h3>
                      <p className="text-white/40 text-sm italic mt-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleOpenModal('service', service)}
                      className="p-4 bg-white/5 hover:bg-white hover:text-black rounded-2xl transition-all"
                    >
                      <Settings size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem('services', service.id)}
                      className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => handleOpenModal('service')}
                className="w-full py-10 border border-dashed border-white/10 rounded-3xl text-white/20 uppercase tracking-[0.5em] font-black hover:border-purple-500/50 hover:text-purple-500 transition-all flex flex-col items-center gap-4"
              >
                <Plus size={32} />
                <span className="text-[10px]">Add New Skillset</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {skills.map((skill) => (
                <div key={skill.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5" style={{ color: skill.color }}>
                      {(() => {
                        const IconObj = AVAILABLE_ICONS.find(i => i.name === skill.icon_name || i.name === skill.icon);
                        const Icon = IconObj ? IconObj.icon : Zap;
                        return <Icon size={20} />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-tight">{skill.name}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-black" style={{ color: skill.color }}>{skill.color}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal('skill', skill)}
                      className="p-2 bg-white/5 hover:bg-white hover:text-black rounded-lg transition-all"
                    >
                      <Settings size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem('skills', skill.id)}
                      className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => handleOpenModal('skill')}
                className="border border-dashed border-white/10 rounded-3xl p-6 text-white/20 uppercase tracking-widest text-[10px] font-black hover:border-purple-500/50 hover:text-purple-500 transition-all flex flex-col items-center gap-2"
              >
                <Plus size={20} />
                <span>New Talent</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {timeline.map((item) => (
                <div key={item.id} className="bg-white/5 p-8 rounded-3xl border border-white/5 flex gap-8 group hover:border-purple-500/30 transition-all">
                  <div className="text-purple-500 text-3xl font-black italic">{item.year}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold uppercase tracking-tight">{item.title}</h3>
                    <p className="text-white/40 text-sm mt-2">{item.description}</p>
                  </div>
                  <div className="flex gap-2 self-start">
                    <button 
                      onClick={() => handleOpenModal('timeline', item)}
                      className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all"
                    >
                      <Settings size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem('timeline', item.id)}
                      className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => handleOpenModal('timeline')}
                className="w-full py-10 border border-dashed border-white/10 rounded-3xl text-white/20 uppercase tracking-[0.5em] font-black hover:border-purple-500/50 hover:text-purple-500 transition-all flex flex-col items-center gap-4"
              >
                <Plus size={32} />
                <span className="text-[10px]">Add Milestone</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Overlay */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-100 flex items-center justify-center p-6"
            >
              <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                onClick={() => setIsModalOpen(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase tracking-widest italic">
                    {editingItem ? 'Update' : 'Create'} {modalType}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                    <LogOutIcon size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveItem} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {modalType === 'project' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Title</label>
                          <input name="title" required className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.title} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Order Index</label>
                          <input name="order_index" type="number" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.order_index || 0} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Category</label>
                          <select name="category" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.category || 'Motion Graphics'}>
                            <option value="Motion Graphics">Motion Graphics</option>
                            <option value="Video Editing">Video Editing</option>
                            <option value="Graphic Design">Graphic Design</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Media Type</label>
                          <select name="type" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.type || 'video'}>
                            <option value="video">Video</option>
                            <option value="image">Image</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Image URL</label>
                        <input name="image" required className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.image} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Video URL (Optional)</label>
                        <input name="video_url" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.video_url} />
                      </div>
                    </>
                  )}

                  {(modalType === 'skill' || modalType === 'service') && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Name/Title</label>
                          <input name="name" required className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.name || editingItem?.title} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Order Index</label>
                          <input name="order_index" type="number" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.order_index || 0} />
                        </div>
                      </div>
                      {modalType === 'service' && (
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Description</label>
                            <textarea name="description" rows={3} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 resize-none" defaultValue={editingItem?.description} />
                         </div>
                      )}
                      
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4 block">Select Icon</label>
                        <div className="grid grid-cols-7 gap-2">
                          {AVAILABLE_ICONS.map((icon) => (
                            <label key={icon.name} className="cursor-pointer">
                              <input 
                                type="radio" 
                                name="icon_name" 
                                value={icon.name} 
                                className="hidden peer" 
                                defaultChecked={editingItem?.icon_name === icon.name || editingItem?.icon === icon.name} 
                              />
                              <div className="w-full aspect-square flex items-center justify-center bg-white/5 border border-transparent rounded-xl peer-checked:border-purple-500 peer-checked:bg-purple-500/10 transition-all hover:bg-white/10">
                                <icon.icon size={18} />
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {modalType === 'skill' && (
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Color Hex (e.g. #9999FF)</label>
                          <div className="flex gap-4">
                             <input name="color" type="color" className="w-16 h-16 bg-transparent border-none p-0 cursor-pointer" defaultValue={editingItem?.color || '#a855f7'} onChange={(e) => {
                               const textInput = (e.target.form as any).hex_display;
                               if (textInput) textInput.value = e.target.value;
                             }} />
                             <input className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" placeholder="#HEX" defaultValue={editingItem?.color || '#a855f7'} onChange={(e) => {
                               const colorInput = (e.target.form as any).color;
                               if (colorInput) colorInput.value = e.target.value;
                             }} />
                          </div>
                        </div>
                      )}

                      {modalType === 'service' && (
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Features (Comma separated)</label>
                          <textarea name="features" rows={2} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 resize-none" placeholder="Feature 1, Feature 2, Feature 3" defaultValue={editingItem?.features?.join(', ')} />
                        </div>
                      )}
                    </>
                  )}

                  {modalType === 'timeline' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Year</label>
                          <input name="year" required className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.year} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Order Index</label>
                          <input name="order_index" type="number" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.order_index || 0} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Job Title / Event</label>
                        <input name="title" required className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500" defaultValue={editingItem?.title} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">Description</label>
                        <textarea name="description" rows={4} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 resize-none" defaultValue={editingItem?.description} />
                      </div>
                    </>
                  )}
                  
                  <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50">
                      {loading ? 'Processing...' : `Save ${modalType}`}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
