export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  full_name: string;
  mobile?: string | null;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: string;
  class_level: string;
  school_name: string;
  target_exam: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  avatar_url?: string;
}

export type ClassLevel = 'VI' | 'VII' | 'VIII' | 'IX' | 'X' | 'XI' | 'XII';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type MaterialType =
  | 'worksheet'
  | 'ncert_solution'
  | 'study_material'
  | 'mock_test'
  | 'formula_sheet'
  | 'question_bank';

export interface Worksheet {
  id: string;
  title: string;
  slug: string;
  class_level: ClassLevel;
  subject: string;
  chapter: string;
  topic?: string;
  difficulty: DifficultyLevel;
  material_type: MaterialType;
  description: string;
  learning_objectives?: string;
  number_of_questions: number;
  number_of_pages: number;
  file_format: string;
  price_paise: number;
  original_price_paise?: number | null;
  is_free: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  preview_pdf_url?: string | null;
  preview_images?: string[];
  blob_url: string;
  blob_pathname?: string;
  secure_storage_key?: string;
  storage_provider: string;
  file_size_bytes: number;
  is_published: boolean;
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  worksheet_id: string;
  worksheet: Worksheet;
  price_paise: number;
}

export interface Cart {
  id: string;
  user_id?: string;
  items: CartItem[];
  coupon_code?: string | null;
  subtotal_paise: number;
  discount_paise: number;
  total_paise: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface OrderItem {
  id: string;
  order_id: string;
  worksheet_id: string;
  worksheet_title: string;
  worksheet_class: string;
  chapter: string;
  price_paise: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  status: OrderStatus;
  subtotal_paise: number;
  discount_paise: number;
  total_paise: number;
  coupon_code?: string | null;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface DownloadEntitlement {
  id: string;
  user_id: string;
  order_id: string;
  worksheet_id: string;
  worksheet?: Worksheet;
  is_active: boolean;
  download_count: number;
  max_downloads: number;
  last_downloaded_at?: string | null;
  expires_at?: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_paise: number;
  max_discount_paise?: number;
  class_level?: string;
  usage_limit: number;
  usage_count: number;
  per_user_limit: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface Enquiry {
  id: string;
  student_name: string;
  phone: string;
  email?: string;
  class_level: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

export interface Review {
  id: string;
  worksheet_id: string;
  user_id: string;
  user_name?: string;
  rating: number;
  title: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface SiteSettings {
  brand: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
  payment_config: {
    provider: 'RAZORPAY' | 'PAYU' | 'MANUAL_TEST';
    test_mode: boolean;
    currency: string;
    key_id?: string;
  };
  hero_banners?: {
    badge: string;
    headline: string;
    subheading: string;
  };
}
