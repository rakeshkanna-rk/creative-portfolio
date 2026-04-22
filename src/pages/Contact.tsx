import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Send, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import FunkyHeading from '../components/FunkyHeading';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { getIcon } from '../lib/icons';

export default function Contact() {
  const { personalInfo, socialLinks, loading } = usePortfolioData();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const formUrl = personalInfo.contact_form_url || 'https://docs.google.com/forms/d/e/1FAIpQLSeJsVO9VKNjWfSSpJNGYOz51BKlJMRaAFTyqh7NZius9qC4MA/formResponse';
    const nameField = personalInfo.contact_name_field || 'entry.1429086625';
    const emailField = personalInfo.contact_email_field || 'entry.570557995';
    const messageField = personalInfo.contact_message_field || 'entry.887881897';

    const formData = new FormData();
    formData.append(nameField, form.name);
    formData.append(emailField, form.email);
    formData.append(messageField, form.message);

    try {
      await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      
      setIsSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Transmission error:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return null;

  return (
    <div className="pt-24 md:pt-40 pb-40 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
      <FunkyHeading as="h1" className="text-[10vw] md:text-[8vw] mb-16 md:mb-32 leading-none">The Contact</FunkyHeading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12 md:space-y-20"
        >
          <div className="space-y-6 md:space-y-10">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">Let's <span className="text-purple-500">Collaborate</span></h2>
            <p className="text-white/40 text-lg md:text-2xl leading-relaxed max-w-md font-light italic">
              Ready to elevate your visual presence? Let's build something cinematic together.
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            <div className="flex items-center gap-6 md:gap-8 group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-purple-600 transition-all duration-500 group-hover:rotate-12 group-hover:border-purple-500 shrink-0">
                <Mail className="text-purple-500 group-hover:text-white transition-colors" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-1">Direct Line</p>
                <p className="text-lg md:text-2xl font-bold tracking-tight">{personalInfo.email}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {socialLinks.map((link: any, i: number) => {
              const Icon = getIcon(link.icon_name || link.icon);
              return (
                <motion.a
                  key={link.id || i}
                  href={link.url || '#'}
                  whileHover={{ y: -8, scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-500 group"
                >
                  <Icon size={20} className="group-hover:text-purple-500 transition-colors" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/5 p-8 md:p-14 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Background Accent */}
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/5 blur-[100px] pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.5em] text-white/20 ml-6">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-purple-500/50 transition-all duration-500 text-sm md:text-base font-light italic"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.5em] text-white/20 ml-6">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-purple-500/50 transition-all duration-500 text-sm md:text-base font-light italic"
                  placeholder="john@example.com"
                />
              </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.5em] text-white/20 ml-6">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-6 focus:outline-none focus:border-purple-500/50 transition-all duration-500 resize-none text-sm md:text-base font-light italic"
                placeholder="Tell me about your vision..."
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSending}
              className={cn(
                "w-full py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-700 text-xs md:text-base shadow-2xl bg-white text-black hover:bg-purple-600 hover:text-white disabled:opacity-50"
              )}
            >
              {isSending ? "POSTING..." : (
                <>
                  Initiate Project <Send size={20} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center px-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsSubmitted(false)} />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-white/10 p-8 md:p-16 rounded-[3rem] relative z-10 max-w-lg w-full text-center space-y-8"
            >
              <button 
                onClick={() => setIsSubmitted(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full"
                />
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                  <CheckCircle2 size={32} className="text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">Transmission <span className="text-purple-500">Succesful</span></h3>
                <p className="text-white/40 font-light italic leading-relaxed">
                  Your vision has been broadcasted to the creative void. Expect a response soon.
                </p>
              </div>

              <button 
                onClick={() => setIsSubmitted(false)}
                className="border border-white/5 bg-white/5 hover:bg-white hover:text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all w-full flex items-center justify-center gap-3"
              >
                Return to Gallery <Sparkles size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
