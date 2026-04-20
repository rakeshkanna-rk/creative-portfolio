-- Enable RLS
-- PERSONAL INFO Table
CREATE TABLE IF NOT EXISTS public.personal_info (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    location TEXT NOT NULL,
    availability TEXT NOT NULL,
    hero_title TEXT,
    hero_subtitle TEXT,
    vision_statement TEXT,
    footer_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROJECTS Table
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'image')),
    description TEXT,
    video_url TEXT,
    aspect_ratio TEXT DEFAULT '16/9',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SERVICES Table
CREATE TABLE IF NOT EXISTS public.services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    icon_name TEXT NOT NULL, -- Name of the Lucide icon
    description TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SKILLS Table
CREATE TABLE IF NOT EXISTS public.skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TIMELINE Table
CREATE TABLE IF NOT EXISTS public.timeline (
    id SERIAL PRIMARY KEY,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ADMIN USER Handling (Optionally a profiles table)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS POLICIES
-- Personal Info
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.personal_info FOR SELECT USING (true);
CREATE POLICY "Admin All" ON public.personal_info FOR ALL USING (auth.role() = 'authenticated');

-- Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin All" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- Services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin All" ON public.services FOR ALL USING (auth.role() = 'authenticated');

-- Skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin All" ON public.skills FOR ALL USING (auth.role() = 'authenticated');

-- Timeline
ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.timeline FOR SELECT USING (true);
CREATE POLICY "Admin All" ON public.timeline FOR ALL USING (auth.role() = 'authenticated');

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own Profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- INITIAL DATA SEED (You can run these separately)
-- INSERT INTO public.personal_info (name, role, email, location, availability, vision) 
-- VALUES ('Monishwar', 'Motion Designer • Video Editor • Visual Creator', 'hello@monishwar.design', 'Digital Space / Remote', 'Open for new projects', 'Crafting high-end visual narratives...');
