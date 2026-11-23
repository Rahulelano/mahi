import { LucideIcon } from 'lucide-react';

export interface Service {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  icon: LucideIcon;
  color: 'orange' | 'blue';
  points: string[];
}

