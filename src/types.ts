/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Post {
  id: string;
  created_at: string;
  title: string;
  excerpt?: string;
  content?: string;
  type: 'news' | 'job' | 'opportunity';
  category: string; 
  city?: string;
  image_url?: string;
  author_id?: string;
  views?: number;
  gallery?: string[];
  published_at?: string;
  badge?: 'new' | 'hot' | 'remote';
  salary?: string;
  registration_link?: string;
  updated_at?: string;
}

export interface StudentEvent {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category: string;
  city: string;
  location_name?: string;
  start_date: string; // ISO string
  end_date?: string;
  price: string; // e.g. "Бесплатно" or "200 МКД"
  ticket_link?: string;
  is_featured: boolean;
  published_at: string;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  secondary_image_url?: string;
  website_url?: string;
  contact_email?: string;
  color?: string;
  is_featured?: boolean;
  created_at?: string;
}

export interface MarqueeMessage {
  id: string;
  text: string;
  bg_color: string;
  text_color: string;
  is_active: boolean;
  priority: number;
  logo_url?: string;
  secondary_image_url?: string;
  link_url?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  title: string;
  subtitle?: string;
  link_url?: string;
  order_index: number;
  active: boolean;
  created_at: string;
}

export interface DailyMessage {
  id: string;
  message: string;
  is_priority: boolean;
  active: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order_index: number;
  created_at?: string;
}
