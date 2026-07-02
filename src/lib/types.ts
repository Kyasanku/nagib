// Domain types shared across the app. These mirror the Supabase schema
// in /supabase/schema.sql so the data layer can swap between live data
// and sample data transparently.

export type ArtworkStatus = "available" | "sold" | "reserved" | "hidden";
export type AnimationStatus = "published" | "draft" | "hidden";
export type CommissionStatus =
  | "new"
  | "reviewing"
  | "accepted"
  | "in_progress"
  | "completed"
  | "rejected";

export type CourseStatus = "published" | "draft" | "hidden";
export type OrderStatus = "pending" | "paid" | "failed" | "shipped" | "refunded";
export type OrderItemType =
  | "artwork_digital"
  | "artwork_print"
  | "course"
  | "donation";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface ArtworkImage {
  id: string;
  artwork_id: string;
  image_url: string;
  alt: string | null;
  sort_order: number;
}

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  category?: Category | null;
  // `price` is the legacy/primary display price (kept for compatibility).
  price: number | null;
  currency: string;
  // Commerce: digital vs print offering.
  digital_price: number | null;
  print_price: number | null;
  allow_digital: boolean;
  allow_print: boolean;
  // Deliverable file for the digital purchase (stored in the private
  // `deliverables` bucket; served via signed URL after payment).
  digital_file_url: string | null;
  status: ArtworkStatus;
  medium: string | null;
  dimensions: string | null;
  year_created: number | null;
  featured_image_url: string;
  images?: ArtworkImage[];
  is_new?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Animation {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string;
  video_url: string;
  duration: string | null;
  status: AnimationStatus;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string;
  artwork_ids?: string[];
  created_at: string;
}

export interface CommissionRequest {
  id: string;
  client_name: string;
  client_email: string;
  phone_number: string | null;
  commission_type: string;
  budget: string | null;
  deadline: string | null;
  description: string;
  reference_images: string[] | null;
  status: CommissionStatus;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string;
  price: number | null;
  currency: string;
  level: string | null;
  status: CourseStatus;
  lessons?: CourseLesson[];
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: string | null;
  sort_order: number;
  is_preview: boolean;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  order_id: string | null;
  buyer_email: string;
  created_at: string;
}

export interface Order {
  id: string;
  reference: string; // tx_ref sent to Flutterwave
  item_type: OrderItemType;
  item_id: string | null;
  item_title: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  amount: number;
  currency: string;
  status: OrderStatus;
  flw_transaction_id: string | null;
  // Shipping (print orders)
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  shipping_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  name: string | null;
  email: string | null;
  amount: number | null;
  currency: string;
  message: string | null;
  status: "pending" | "paid" | "failed";
  created_at: string;
}

export interface PurchaseInquiry {
  id: string;
  artwork_id: string | null;
  buyer_name: string;
  buyer_email: string;
  message: string | null;
  status: "new" | "responded" | "closed";
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  email: string | null;
  instagram: string | null;
  twitter: string | null;
  behance: string | null;
}

export interface FeaturedItem {
  id: string;
  item_type: "artwork" | "animation" | "collection";
  item_id: string;
  headline: string | null;
  subheadline: string | null;
  sort_order: number;
}

export interface Row {
  title: string;
  slug: string;
  items: Artwork[];
}
