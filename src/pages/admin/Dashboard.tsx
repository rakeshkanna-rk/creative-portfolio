import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  Reorder,
  useDragControls,
} from "motion/react";
import { supabase } from "../../lib/supabase";
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
  ChevronUp,
  ChevronDown,
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
  Check,
  Search,
  Wand2,
  Sparkles,
  Camera,
  Scissors,
  Frame,
  GripVertical,
  Upload,
} from "lucide-react";
import {
  SiFigma,
  SiBlender,
  SiCanva,
  SiDavinciresolve,
  SiGithub,
} from "react-icons/si";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AVAILABLE_ICONS } from "../../lib/icons";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "project" | "service" | "skill" | "timeline" | "social" | null
  >(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [personalInfo, setPersonalInfo] = useState<any>({});
  const [customIconUrl, setCustomIconUrl] = useState<string>("");
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Motion Graphics");
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchAllData();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) navigate("/admin/login");
  }

  async function fetchAllData() {
    setLoading(true);
    try {
      const { data: info } = await supabase
        .from("personal_info")
        .select("*")
        .single();
      if (info) setPersonalInfo(info);

      const { data: proj } = await supabase
        .from("projects")
        .select("*")
        .order("order_index");
      if (proj) setProjects(proj);

      const { data: serv } = await supabase
        .from("services")
        .select("*")
        .order("order_index");
      if (serv) setServices(serv);

      const { data: skil } = await supabase
        .from("skills")
        .select("*")
        .order("order_index");
      if (skil) setSkills(skil);

      const { data: time } = await supabase
        .from("timeline")
        .select("*")
        .order("event_date", { ascending: false });
      if (time) setTimeline(time);

      const { data: soc } = await supabase
        .from("social_links")
        .select("*")
        .order("order_index");
      if (soc) setSocialLinks(soc);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updates = Object.fromEntries(formData.entries());

    try {
      const dataToUpsert = personalInfo?.id
        ? { id: personalInfo.id, ...updates }
        : updates;
      const { error } = await supabase
        .from("personal_info")
        .upsert(dataToUpsert);

      if (error) throw error;
      toast.success("Identity Unified");
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Permanent deletion authorized?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast.success("Fragment Deleted");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  async function fetchProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("order_index");
    if (data) setProjects(data);
  }

  const handleOpenModal = (type: any, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setCustomIconUrl(item?.icon_name?.startsWith("http") ? item.icon_name : "");
    setSelectedCategory(item?.category || "Motion Graphics");
    setIsModalOpen(true);
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIcon(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `icon_${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("icons")
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("icons")
        .getPublicUrl(data.path);
      setCustomIconUrl(urlData.publicUrl);
      toast.success("Icon uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingIcon(false);
    }
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

    // If custom icon was uploaded, use that URL as icon_name
    if (customIconUrl && (modalType === "skill" || modalType === "service")) {
      data.icon_name = customIconUrl;
    }

    // Handle array for services features
    if (modalType === "service" && data.features) {
      data.features = (data.features as string)
        .split(",")
        .map((f) => f.trim()) as any;
    }

    try {
      const tableMap: Record<string, string> = {
        project: "projects",
        service: "services",
        skill: "skills",
        timeline: "timeline",
        social: "social_links",
      };

      const table = tableMap[modalType!];
      const { error } = await supabase
        .from(table)
        .upsert(editingItem?.id ? { id: editingItem.id, ...data } : data);

      if (error) throw error;
      toast.success("Reality Branch Merged");
      setIsModalOpen(false);
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveProject = async (
    id: number,
    direction: "up" | "down",
    category: string,
  ) => {
    const catProjects = [...projects]
      .filter((p) => p.category === category)
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0) || a.id - b.id);

    const index = catProjects.findIndex((p) => p.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === catProjects.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newItems = [...catProjects];
    const [movedItem] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, movedItem);

    // Persist all new indices for this category
    try {
      const updates = newItems.map((item, i) => ({
        id: item.id,
        order_index: i,
        // Carry over other needed fields if upsert requires them, 
        // but here we just want to update order_index.
        // Supabase upsert with ID will update existing or insert new.
        // To be safe and minimal, we use a single query if possible or multiple.
      }));

      for (const update of updates) {
        await supabase
          .from("projects")
          .update({ order_index: update.order_index })
          .eq("id", update.id);
      }

      toast.success("Sequence Shifted");
      fetchAllData();
    } catch (error: any) {
      toast.error("Quantization Error");
    }
  };

  const handleMoveGeneral = async (
    type: "services" | "skills" | "social_links",
    id: number,
    direction: "up" | "down",
  ) => {
    const list =
      type === "services"
        ? services
        : type === "skills"
          ? skills
          : socialLinks;
    const sortedList = [...list].sort(
      (a, b) => (a.order_index || 0) - (b.order_index || 0) || a.id - b.id,
    );

    const index = sortedList.findIndex((p) => p.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sortedList.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newItems = [...sortedList];
    const [movedItem] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, movedItem);

    try {
      for (let i = 0; i < newItems.length; i++) {
        await supabase
          .from(type)
          .update({ order_index: i })
          .eq("id", newItems[i].id);
      }

      toast.success("Sequence Shifted");
      fetchAllData();
    } catch (error: any) {
      toast.error("Quantization Error");
    }
  };

  const handleDeleteItem = async (table: string, id: number) => {
    if (!confirm("Permanent deletion authorized?")) return;
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      toast.success("Fragment Deleted");
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-black p-8 flex flex-col fixed h-full z-50">
        <div className="mb-12">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-purple-500">
            Portfolio OS
          </h1>
          <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold mt-1">
            Management Hub
          </p>
        </div>

        <nav className="space-y-4 flex-1">
          {[
            { id: "projects", label: "Showcase", icon: Briefcase },
            { id: "info", label: "Identity", icon: LayoutDashboard },
            { id: "services", label: "The Craft", icon: Settings },
            { id: "skills", label: "The Talents", icon: Zap },
            { id: "timeline", label: "The Journey", icon: Clock },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 group ${
                activeTab === item.id
                  ? "bg-purple-600 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                  : "bg-white/5 border-transparent hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon
                  size={20}
                  className={
                    activeTab === item.id
                      ? "text-white"
                      : "text-white/40 group-hover:text-white"
                  }
                />
                <span
                  className={`text-sm font-black uppercase tracking-widest ${activeTab === item.id ? "text-white" : "text-white/40 group-hover:text-white"}`}
                >
                  {item.label}
                </span>
              </div>
              <ChevronRight
                size={16}
                className={activeTab === item.id ? "text-white" : "opacity-0"}
              />
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="p-4 bg-white/5 rounded-2xl border border-transparent hover:border-red-500/50 hover:bg-red-500/10 transition-all flex items-center gap-4 text-white/40 hover:text-red-500 mt-auto"
        >
          <LogOutIcon size={20} />
          <span className="text-sm font-black uppercase tracking-widest">
            Terminate Session
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-80 flex-1 p-12 bg-[#050505]">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter italic">
              {activeTab === "projects" && "The Showcase"}
              {activeTab === "info" && "The Identity"}
              {activeTab === "services" && "The Craft"}
              {activeTab === "skills" && "The Talents"}
              {activeTab === "timeline" && "The Journey"}
            </h2>
            <p className="text-white/20 text-xs uppercase tracking-[0.5em] mt-2">
              Manage your visual reality
            </p>
          </div>

          {activeTab === "projects" && (
            <button
              onClick={() => handleOpenModal("project")}
              className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all shadow-xl"
            >
              <Plus size={16} /> New Fragment
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 pb-20"
            >
              {["Motion Graphics", "Video Editing", "Graphic Design"].map(
                (cat) => {
                  const catProjects = projects
                    .filter((p) => p.category === cat)
                    .sort(
                      (a, b) => (a.order_index || 0) - (b.order_index || 0) || a.id - b.id
                    );

                  return (
                    <div key={cat} className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-8 bg-purple-500 rounded-full" />
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">
                          {cat}
                        </h3>
                        <span className="text-white/20 text-xs font-bold font-mono">
                          [{catProjects.length}]
                        </span>
                      </div>

                      {catProjects.length > 0 ? (
                        <Reorder.Group
                          axis="y"
                          values={catProjects}
                          onReorder={async (newOrder) => {
                            // Update local state first for snapiness
                            const otherProjects = projects.filter(p => p.category !== cat);
                            const updatedProjects = [...otherProjects, ...newOrder];
                            setProjects(updatedProjects);
                          }}
                          onDragEnd={async () => {
                            // Only persist to DB when user finishes dragging
                            const catProjects = projects.filter(p => p.category === cat);
                            try {
                              for (let i = 0; i < catProjects.length; i++) {
                                await supabase
                                  .from("projects")
                                  .update({ order_index: i })
                                  .eq("id", catProjects[i].id);
                              }
                              toast.info("Order synched to reality");
                            } catch (e) {
                              toast.error("Desync Error");
                            }
                          }}
                          className="space-y-4"
                        >
                          {catProjects.map((project, idx) => (
                            <ProjectRow
                              key={project.id}
                              project={project}
                              idx={idx}
                              catProjects={catProjects}
                              cat={cat}
                              onOpenModal={handleOpenModal}
                              onDelete={handleDeleteItem}
                              onMove={handleMoveProject}
                            />
                          ))}
                        </Reorder.Group>
                      ) : (
                        <div className="py-12 text-center border border-dashed border-white/5 rounded-3xl">
                          <p className="text-white/10 uppercase tracking-[0.3em] text-[10px]">
                            Void Space - No Fragments in {cat}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </motion.div>
          )}

          {activeTab === "info" && (
            <motion.form
              key="info"
              onSubmit={handleSaveIdentity}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl space-y-16 pb-20"
            >
              {/* Home Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-6 bg-purple-500 rounded-full" />
                  <h3 className="text-xl font-black uppercase tracking-widest italic opacity-50">
                    Home / Identity
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                      Full Moniker
                    </label>
                    <input
                      name="name"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-purple-500 focus:bg-white/10"
                      defaultValue={personalInfo?.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                      Designation
                    </label>
                    <input
                      name="role"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-purple-500 focus:bg-white/10"
                      defaultValue={personalInfo?.role}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                      Hero Heading
                    </label>
                    <input
                      name="hero_title"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-purple-500 focus:bg-white/10"
                      defaultValue={personalInfo?.hero_title}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                      Availability Status
                    </label>
                    <input
                      name="availability"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-purple-500 focus:bg-white/10"
                      defaultValue={personalInfo?.availability}
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-6 bg-purple-500 rounded-full" />
                  <h3 className="text-xl font-black uppercase tracking-widest italic opacity-50">
                    About / Personal Bio
                  </h3>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                    Extended Story
                  </label>
                  <textarea
                    name="bio"
                    rows={6}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10 resize-none font-light leading-relaxed"
                    defaultValue={personalInfo?.bio}
                    placeholder="Tell your story..."
                  />
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-6 bg-purple-500 rounded-full" />
                  <h3 className="text-xl font-black uppercase tracking-widest italic opacity-50">
                    Contact / Google Forms
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                      GForm Response URL
                    </label>
                    <input
                      name="contact_form_url"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-purple-500 focus:bg-white/10 font-mono text-xs"
                      defaultValue={personalInfo?.contact_form_url}
                      placeholder="https://docs.google.com/forms/d/e/.../formResponse"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                        Name Field ID
                      </label>
                      <input
                        name="contact_name_field"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 focus:bg-white/10 font-mono text-xs"
                        defaultValue={personalInfo?.contact_name_field}
                        placeholder="entry.12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                        Email Field ID
                      </label>
                      <input
                        name="contact_email_field"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 focus:bg-white/10 font-mono text-xs"
                        defaultValue={personalInfo?.contact_email_field}
                        placeholder="entry.67890"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                        Message Field ID
                      </label>
                      <input
                        name="contact_message_field"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 focus:bg-white/10 font-mono text-xs"
                        defaultValue={personalInfo?.contact_message_field}
                        placeholder="entry.54321"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-6 bg-purple-500 rounded-full" />
                  <h3 className="text-xl font-black uppercase tracking-widest italic opacity-50">
                    Footer / Global
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                      Global Email
                    </label>
                    <input
                      name="email"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-purple-500 focus:bg-white/10"
                      defaultValue={personalInfo?.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                      Footer Text
                    </label>
                    <input
                      name="footer_text"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-purple-500 focus:bg-white/10"
                      defaultValue={personalInfo?.footer_text}
                    />
                  </div>
                </div>
              </div>

              {/* Social Presence Section */}
              <div className="space-y-8 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-6 bg-purple-500 rounded-full" />
                    <h3 className="text-xl font-black uppercase tracking-widest italic opacity-50">
                      Social Presence
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenModal("social")}
                    className="bg-white/5 hover:bg-white hover:text-black p-3 rounded-xl border border-white/5 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} />
                    <span className="text-[10px] uppercase font-black tracking-widest">
                      Add Source
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialLinks
                    .sort(
                      (a, b) =>
                        (a.order_index || 0) - (b.order_index || 0) ||
                        a.id - b.id,
                    )
                    .map((link, idx) => (
                      <div
                        key={link.id}
                        className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-purple-500">
                            {(() => {
                              const iconName = link.icon_name || "Globe";
                              const IconObj = AVAILABLE_ICONS.find(
                                (i) => i.name === iconName,
                              );
                              const Icon = IconObj ? IconObj.icon : Globe;
                              return <Icon size={18} />;
                            })()}
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-tight">
                              {link.name}
                            </p>
                            <p className="text-[10px] text-white/20 truncate max-w-[150px]">
                              {link.url}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5 border-r border-white/5 pr-1 mr-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleMoveGeneral("social_links", link.id, "up")
                              }
                              disabled={idx === 0}
                              className="p-1 hover:bg-white/10 rounded-md text-white/20 hover:text-white transition-all disabled:opacity-0"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleMoveGeneral(
                                  "social_links",
                                  link.id,
                                  "down",
                                )
                              }
                              disabled={idx === socialLinks.length - 1}
                              className="p-1 hover:bg-white/10 rounded-md text-white/20 hover:text-white transition-all disabled:opacity-0"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenModal("social", link)}
                            className="p-2 text-white/20 hover:text-white transition-colors"
                          >
                            <Settings size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteItem("social_links", link.id)
                            }
                            className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-12 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-purple-500 transition-all shadow-[0_0_40px_rgba(168,85,247,0.3)] disabled:opacity-50"
                >
                  <Save
                    size={20}
                    className="group-hover:scale-125 transition-transform"
                  />{" "}
                  {loading ? "UPDATING..." : "UPDATE REALITY"}
                </button>
              </div>
            </motion.form>
          )}

          {activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <button
                onClick={() => handleOpenModal("service")}
                className="w-full py-10 border border-dashed border-white/50 rounded-3xl text-white/50 uppercase tracking-[0.2em] font-black hover:border-purple-500/50 hover:text-purple-500 transition-all flex flex-col items-center gap-4"
              >
                <Plus size={32} />
                <span className="text-[10px]">Add New Service</span>
              </button>
              {services
                .sort((a, b) => (a.order_index || 0) - (b.order_index || 0) || a.id - b.id)
                .map((service, idx) => (
                  <div
                    key={service.id}
                    className="bg-white/5 p-8 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-purple-500 overflow-hidden p-3">
                        {(() => {
                          const iconVal = service.icon_name || service.icon;
                          if (iconVal?.startsWith("http")) {
                            return (
                              <img
                                src={iconVal}
                                alt=""
                                className="w-full h-full object-contain brightness-0 invert"
                              />
                            );
                          }
                          const IconObj = AVAILABLE_ICONS.find(
                            (i) => i.name === iconVal,
                          );
                          const Icon = IconObj ? IconObj.icon : Settings;
                          return <Icon size={28} />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold uppercase tracking-tight truncate">
                          {service.title}
                        </h3>
                        <p className="text-white/40 text-sm italic mt-1 w-full text-wrap pr-0.5">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 mr-2 px-2 border-r border-white/5">
                        <button
                          onClick={() =>
                            handleMoveGeneral("services", service.id, "up")
                          }
                          disabled={idx === 0}
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all disabled:opacity-0"
                        >
                          <ChevronUp size={20} />
                        </button>
                        <button
                          onClick={() =>
                            handleMoveGeneral("services", service.id, "down")
                          }
                          disabled={idx === services.length - 1}
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all disabled:opacity-0"
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleOpenModal("service", service)}
                        className="p-4 bg-white/5 hover:bg-white hover:text-black rounded-2xl transition-all"
                      >
                        <Settings size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem("services", service.id)}
                        className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <button
                onClick={() => handleOpenModal("skill")}
                className=" align-center justify-center border border-dashed border-white/50 rounded-3xl p-6 text-white/50 uppercase tracking-widest text-[10px] font-black hover:border-purple-500/50 hover:text-purple-500 transition-all flex flex-col items-center gap-2"
              >
                <Plus size={20} />
                <span>New Skill</span>
              </button>
              {skills
                .sort((a, b) => (a.order_index || 0) - (b.order_index || 0) || a.id - b.id)
                .map((skill, idx) => (
                  <div
                    key={skill.id}
                    className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col items-start gap-3 group hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 overflow-hidden p-2"
                        style={{ color: skill.color }}
                      >
                        {(() => {
                          const iconVal = skill.icon_name || skill.icon;
                          if (iconVal?.startsWith("http")) {
                            return (
                              <img
                                src={iconVal}
                                alt=""
                                className="w-full h-full object-contain"
                                style={{
                                  filter: `drop-shadow(0 0 4px ${skill.color})`,
                                }}
                              />
                            );
                          }
                          const IconObj = AVAILABLE_ICONS.find(
                            (i) => i.name === iconVal,
                          );
                          const Icon = IconObj ? IconObj.icon : Zap;
                          return <Icon size={20} />;
                        })()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold uppercase tracking-tight truncate">
                          {skill.name}
                        </h3>
                        <p
                          className="text-[10px] text-white/40 uppercase tracking-widest font-black truncate"
                          style={{ color: skill.color }}
                        >
                          {skill.color}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center gap-0.5 border-r border-white/5 pr-1 mr-1">
                        <button
                          onClick={() =>
                            handleMoveGeneral("skills", skill.id, "up")
                          }
                          disabled={idx === 0}
                          className="p-1 hover:bg-white/10 rounded-md text-white/20 hover:text-white transition-all disabled:opacity-0"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleMoveGeneral("skills", skill.id, "down")
                          }
                          disabled={idx === skills.length - 1}
                          className="p-1 hover:bg-white/10 rounded-md text-white/20 hover:text-white transition-all disabled:opacity-0"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleOpenModal("skill", skill)}
                        className="p-2 bg-white/5 hover:bg-white hover:text-black rounded-lg transition-all"
                      >
                        <Settings size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem("skills", skill.id)}
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
            </motion.div>
          )}

          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <button
                onClick={() => handleOpenModal("timeline")}
                className="w-full py-10 border border-dashed border-white/50 rounded-3xl text-white/50 uppercase tracking-[0.2em] font-black hover:border-purple-500/50 hover:text-purple-500 transition-all flex flex-col items-center gap-4"
              >
                <Plus size={32} />
                <span className="text-[10px]">Add Milestone</span>
              </button>
              {timeline.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 p-8 rounded-3xl border border-white/5 flex gap-8 group hover:border-purple-500/30 transition-all"
                >
                  <div className="text-purple-500 text-3xl font-black italic">
                    {item.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-white/40 text-sm mt-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex gap-2 self-start">
                    <button
                      onClick={() => handleOpenModal("timeline", item)}
                      className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all"
                    >
                      <Settings size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem("timeline", item.id)}
                      className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-5xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase tracking-widest italic">
                    {editingItem ? "Update" : "Create"} {modalType}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/20 hover:text-white transition-colors"
                  >
                    <LogOutIcon size={20} />
                  </button>
                </div>

                <form
                  onSubmit={handleSaveItem}
                  data-lenis-prevent
                  className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar"
                >
                  {modalType === "project" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Title
                          </label>
                          <input
                            name="title"
                            required
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
                            defaultValue={editingItem?.title}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Ratio
                          </label>
                          <select
                            name="aspect_ratio"
                            className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 text-white [&>option]:bg-zinc-900 [&>option]:text-white"
                            defaultValue={editingItem?.aspect_ratio || "16/9"}
                          >
                            <option value="16/9">16/9 (Desktop)</option>
                            <option value="9/16">9/16 (Reels/Shorts)</option>
                            <option value="4/5">4/5 (Instagram)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Category
                          </label>
                          <select
                            name="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 text-white [&>option]:bg-zinc-900 [&>option]:text-white"
                          >
                            <option value="Motion Graphics">
                              Motion Graphics
                            </option>
                            <option value="Video Editing">Video Editing</option>
                            <option value="Graphic Design">
                              Graphic Design
                            </option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Media Type (Auto)
                          </label>
                          <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white/40 font-bold uppercase tracking-widest flex items-center gap-3">
                            {selectedCategory === "Graphic Design" ? (
                              <>
                                <ImageIcon size={16} />
                                <span>Image</span>
                                <input type="hidden" name="type" value="image" />
                              </>
                            ) : (
                              <>
                                <Video size={16} />
                                <span>Video</span>
                                <input type="hidden" name="type" value="video" />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                          Image URL
                        </label>
                        <input
                          name="image"
                          required
                          className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
                          defaultValue={editingItem?.image}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                          Video URL (Optional)
                        </label>
                        <input
                          name="video_url"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
                          defaultValue={editingItem?.video_url}
                          placeholder="YouTube URL or Direct Video link (.mp4)"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                          Description
                        </label>
                        <textarea
                          name="description"
                          rows={4}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 resize-none"
                          defaultValue={editingItem?.description}
                          placeholder="Describe the fragments..."
                        />
                      </div>
                    </>
                  )}

                  {(modalType === "skill" ||
                    modalType === "service" ||
                    modalType === "social") && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Name/Title
                          </label>
                          <input
                            name="name"
                            required
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
                            defaultValue={
                              editingItem?.name || editingItem?.title
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            {modalType === "social" ? "Profile URL" : "Order Index"}
                          </label>
                          <input
                            name={modalType === "social" ? "url" : "order_index"}
                            required={modalType === "social"}
                            type={modalType === "social" ? "text" : "number"}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
                            defaultValue={
                              modalType === "social"
                                ? editingItem?.url
                                : editingItem?.order_index || 0
                            }
                            placeholder={modalType === "social" ? "https://..." : "0"}
                          />
                        </div>
                      </div>
                      {modalType === "social" && (
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Order Index
                          </label>
                          <input
                            name="order_index"
                            type="number"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
                            defaultValue={editingItem?.order_index || 0}
                          />
                        </div>
                      )}
                      {modalType === "service" && (
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Description
                          </label>
                          <textarea
                            name="description"
                            rows={3}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 resize-none"
                            defaultValue={editingItem?.description}
                          />
                        </div>
                      )}

                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4 block">
                          Select Icon
                        </label>
                        <div className="grid grid-cols-10 gap-2">
                          {AVAILABLE_ICONS.map((icon) => (
                            <label
                              key={icon.name}
                              className="cursor-pointer group relative"
                            >
                              <input
                                type="radio"
                                name="icon_name"
                                value={icon.name}
                                className="hidden peer"
                                defaultChecked={
                                  !customIconUrl &&
                                  (editingItem?.icon_name === icon.name ||
                                    editingItem?.icon === icon.name)
                                }
                                onChange={() => setCustomIconUrl("")}
                              />
                              <div className="w-full aspect-square flex items-center justify-center bg-white/5 border border-white/5 rounded-xl peer-checked:border-purple-500 peer-checked:bg-purple-500/10 transition-all hover:bg-white/10">
                                <icon.icon size={18} />
                              </div>
                              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                                {(icon as any).label || icon.name}
                              </div>
                            </label>
                          ))}
                        </div>

                        {/* Custom Icon Upload */}
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1 mb-3">
                            Or Upload Custom Icon
                          </p>
                          <div className="flex items-center gap-4">
                            <label className="cursor-pointer flex-1">
                              <input
                                type="file"
                                accept="image/*,.svg"
                                className="hidden"
                                onChange={handleIconUpload}
                              />
                              <div
                                className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-dashed transition-all ${
                                  customIconUrl
                                    ? "border-purple-500 bg-purple-500/10 text-purple-400"
                                    : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/50"
                                }`}
                              >
                                {uploadingIcon ? (
                                  <span className="text-xs animate-pulse">
                                    Uploading...
                                  </span>
                                ) : (
                                  <>
                                    <Upload size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                      {customIconUrl
                                        ? "Change Icon"
                                        : "Upload SVG / PNG"}
                                    </span>
                                  </>
                                )}
                              </div>
                            </label>
                            {customIconUrl && (
                              <div className="w-14 h-14 rounded-xl border border-purple-500 bg-purple-500/10 flex items-center justify-center overflow-hidden shrink-0">
                                <img
                                  src={customIconUrl}
                                  alt="Custom icon"
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {modalType === "skill" && (
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Color Hex (e.g. #9999FF)
                          </label>
                          <div className="flex gap-4">
                            <input
                              name="color"
                              type="color"
                              className="w-16 h-16 bg-transparent border-none p-0 cursor-pointer"
                              defaultValue={editingItem?.color || "#a855f7"}
                              onChange={(e) => {
                                const textInput = (e.target.form as any)
                                  .hex_display;
                                if (textInput) textInput.value = e.target.value;
                              }}
                            />
                            <input
                              className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
                              placeholder="#HEX"
                              defaultValue={editingItem?.color || "#a855f7"}
                              onChange={(e) => {
                                const colorInput = (e.target.form as any).color;
                                if (colorInput)
                                  colorInput.value = e.target.value;
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {modalType === "service" && (
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Features (Comma separated)
                          </label>
                          <textarea
                            name="features"
                            rows={2}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 resize-none"
                            placeholder="Feature 1, Feature 2, Feature 3"
                            defaultValue={editingItem?.features?.join(", ")}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {modalType === "timeline" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Exact Date
                          </label>
                          <input
                            name="event_date"
                            type="date"
                            required
                            className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 text-white scheme-dark"
                            defaultValue={
                              editingItem?.event_date ||
                              new Date().toISOString().split("T")[0]
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                            Year (Label)
                          </label>
                          <input
                            name="year"
                            required
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
                            defaultValue={editingItem?.year}
                            placeholder="e.g., 2024"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                          Job Title / Event
                        </label>
                        <input
                          name="title"
                          required
                          className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
                          defaultValue={editingItem?.title}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-4">
                          Description
                        </label>
                        <textarea
                          name="description"
                          rows={4}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 resize-none"
                          defaultValue={editingItem?.description}
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50"
                    >
                      {loading ? "Processing..." : `Save ${modalType}`}
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

function ProjectRow({
  project,
  idx,
  catProjects,
  cat,
  onOpenModal,
  onDelete,
  onMove,
}: any) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={project}
      dragListener={false}
      dragControls={controls}
      className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex items-center group hover:border-purple-500/30 transition-all cursor-default"
    >
      <div className="w-40 aspect-video relative shrink-0 bg-zinc-900 border-r border-white/5">
        <img
          src={project.image}
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="flex-1 p-6 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold uppercase tracking-tight line-clamp-1">
            {project.title}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-purple-500/60">
              {project.type}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/20">
              {project.aspect_ratio || "16/9"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 mr-2 px-2 border-r border-white/5">
            <div className="flex gap-1">
              <button
                onClick={() => onMove(project.id, "up", cat)}
                disabled={idx === 0}
                className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all disabled:opacity-0"
                title="Move Up"
              >
                <ChevronUp size={20} />
              </button>
              <button
                onClick={() => onMove(project.id, "down", cat)}
                disabled={idx === catProjects.length - 1}
                className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all disabled:opacity-0"
                title="Move Down"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
          <button
            onClick={() => onOpenModal("project", project)}
            className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl border border-white/5 transition-all text-white/40"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => onDelete("projects", project.id)}
            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}
