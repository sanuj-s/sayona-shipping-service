// ═══════════════════════════════════════════════
// Sayona Shipping — TypeScript Type Definitions
// ═══════════════════════════════════════════════

// ─── API Response Envelope ───
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
  };
}

// ─── Shipment ───
export type ShipmentStatus =
  | "CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "ARRIVED_AT_WAREHOUSE"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED_DELIVERY"
  | "RETURNED";

export type ShippingType = "ocean_fcl" | "ocean_lcl" | "air" | "ground";

export interface Shipment {
  uuid: string;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  shippingType: ShippingType;
  price?: number;
  weight?: number;
  dimensions?: string;
  industryType?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

// ─── Tracking ───
export interface TrackingEvent {
  uuid: string;
  status: string;
  location: string;
  description?: string;
  createdAt: string;
  timestamp?: string; // backwards compat for frontend logic
}

export interface TrackingResult {
  shipment: Shipment;
  history: TrackingEvent[];
}

// ─── Contact ───
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  origin?: string;
  destination?: string;
  industry?: string;
  message?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

// ─── Quote ───
export interface Quote {
  id: string;
  uuid: string;
  name: string;
  cargo: string;
  cargoType?: string;
  origin: string;
  destination: string;
  email: string;
  weight?: string;
  volume?: string;
  message?: string;
  status: "pending" | "reviewed" | "quoted" | "accepted" | "rejected";
  createdAt: string;
}

// ─── User ───
export type UserRole = "admin" | "client" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ─── Dashboard ───
export interface DashboardStats {
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  pendingQuotes: number;
  newContacts: number;
  totalUsers: number;
  recentShipments: Shipment[];
}

// ─── Navigation ───
export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

export interface NavDropdown {
  label: string;
  href: string;
  children: NavDropdownColumn[];
}

export interface NavDropdownColumn {
  title: string;
  items: NavLink[];
}

// ─── Content Types ───
export interface ServiceData {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  image: string;
  href: string;
}

export interface IndustryData {
  slug: string;
  title: string;
  icon: string;
  description: string;
  image: string;
}

export interface TestimonialData {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarColor: string;
}

export interface StatData {
  value: number;
  suffix?: string;
  label: string;
  icon: string;
}

export interface FAQData {
  question: string;
  answer: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface LocationData {
  name: string;
  icon: string;
  description: string;
  region: string;
  isHQ?: boolean;
}

export interface JobListing {
  title: string;
  location: string;
  type: string;
  department: string;
}

export interface PerkData {
  icon: string;
  title: string;
  description: string;
}
