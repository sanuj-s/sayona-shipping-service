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
  | "Pending"
  | "Picked Up"
  | "In Transit"
  | "At Port"
  | "Arrived at Destination"
  | "Customs Clearance"
  | "Out for Delivery"
  | "Delivered"
  | "Failed"
  | "Returned";

export type ShippingType = "ocean_fcl" | "ocean_lcl" | "air" | "ground";

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone?: string;
  origin: string;
  destination: string;
  weight?: number;
  dimensions?: string;
  cargoType?: string;
  shippingType: ShippingType;
  status: ShipmentStatus;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Tracking ───
export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: string;
  location: string;
  description?: string;
  timestamp: string;
  createdAt: string;
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
  cargo: string;
  origin: string;
  destination: string;
  email: string;
  weight?: number;
  volume?: string;
  status: "pending" | "quoted" | "accepted" | "rejected";
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
  token: string;
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
