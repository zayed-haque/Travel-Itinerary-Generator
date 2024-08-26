import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface TravelOption {
  icon: ReactNode;
  title: string;
}

export interface Category {
  name: string;
  icon: LucideIcon;
}

export interface Message {
  id: number;
  type: 'user' | 'bot' | 'system';
  content: React.ReactNode;
  images?: { url: string; attribution: string }[];
}
