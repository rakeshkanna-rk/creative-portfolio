import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Access Granted');
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (error: any) {
      toast.error(error.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 relative overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 blur-[150px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 blur-[150px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <motion.h1 
              className="text-4xl font-black uppercase tracking-tighter italic mb-2"
              animate={{ color: ['#fff', '#a855f7', '#fff'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Admin Access
            </motion.h1>
            <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Secure Gateway</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-4">Identity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-purple-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@monishwar.design"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500 transition-all focus:bg-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-4">Secret Code</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-purple-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500 transition-all focus:bg-white/10"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? 'Decrypting...' : (
                <>
                  Enter Dashboard <LogIn size={18} />
                </>
              )}
            </motion.button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-white/20 text-[10px] uppercase tracking-[0.5em]">
          Monishwar Portfolio Control Unit
        </p>
      </motion.div>
    </div>
  );
}
