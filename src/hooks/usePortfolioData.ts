import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PERSONAL_INFO, PROJECTS, SERVICES, SKILLS, TIMELINE } from '../data/webData';

export function usePortfolioData() {
  const [data, setData] = useState({
    personalInfo: PERSONAL_INFO,
    projects: PROJECTS,
    services: SERVICES,
    skills: SKILLS,
    timeline: TIMELINE,
    socialLinks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [info, proj, serv, skil, time, soc] = await Promise.all([
          supabase.from('personal_info').select('*').maybeSingle(),
          supabase.from('projects').select('*').order('order_index'),
          supabase.from('services').select('*').order('order_index'),
          supabase.from('skills').select('*').order('order_index'),
          supabase.from('timeline').select('*').order('event_date', { ascending: false }),
          supabase.from('social_links').select('*').order('order_index'),
        ]);

        setData({
          personalInfo: info.data || PERSONAL_INFO,
          projects: proj.data || PROJECTS,
          services: serv.data
            ? serv.data.map((s: any) => ({ ...s, icon: s.icon_name || s.icon })) 
            : SERVICES,
          skills: skil.data
            ? skil.data.map((s: any) => ({ ...s, icon: s.icon_name || s.icon })) 
            : SKILLS,
          timeline: time.data
            ? time.data.map((t: any) => ({ ...t, desc: t.description || t.desc })) 
            : TIMELINE,
          socialLinks: soc.data && soc.data.length > 0 ? soc.data : [
            { name: 'Instagram', url: '#', icon_name: 'Instagram' },
            { name: 'Twitter', url: '#', icon_name: 'Twitter' },
            { name: 'LinkedIn', url: '#', icon_name: 'Linkedin' },
          ],
        });
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { ...data, loading };
}
