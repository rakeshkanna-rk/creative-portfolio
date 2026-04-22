import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Github, 
  Mail, 
  Globe, 
  Figma, 
  Facebook, 
  Zap, 
  Settings, 
  Camera, 
  Video, 
  Palette, 
  Laptop, 
  Cpu, 
  Code, 
  Smartphone, 
  Image as ImageIcon, 
  Music, 
  Share2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const AVAILABLE_ICONS = [
  { name: 'Instagram', icon: Instagram },
  { name: 'Twitter', icon: Twitter },
  { name: 'Linkedin', icon: Linkedin },
  { name: 'Youtube', icon: Youtube },
  { name: 'Github', icon: Github },
  { name: 'Mail', icon: Mail },
  { name: 'Globe', icon: Globe },
  { name: 'Figma', icon: Figma },
  { name: 'Facebook', icon: Facebook },
  { name: 'Zap', icon: Zap },
  { name: 'Settings', icon: Settings },
  { name: 'Camera', icon: Camera },
  { name: 'Video', icon: Video },
  { name: 'Palette', icon: Palette },
  { name: 'Laptop', icon: Laptop },
  { name: 'Cpu', icon: Cpu },
  { name: 'Code', icon: Code },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Image', icon: ImageIcon },
  { name: 'Music', icon: Music },
  { name: 'Share', icon: Share2 },
  { name: 'Link', icon: ExternalLink},
  { name: 'Message', icon: MessageSquare }
];

export function getIcon(name: string) {
  const IconObj = AVAILABLE_ICONS.find(i => i.name === name);
  return IconObj ? IconObj.icon : Globe;
}
