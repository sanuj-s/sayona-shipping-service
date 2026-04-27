// ═══════════════════════════════════════════════
// Sayona Shipping Services — Site Constants & Content Data
// ═══════════════════════════════════════════════

import type {
  ServiceData,
  IndustryData,
  TestimonialData,
  StatData,
  FAQData,
  TimelineEntry,
  LocationData,
  JobListing,
  PerkData,
} from "@/lib/types";

// ─── Site Metadata ───
export const SITE = {
  name: "Sayona Shipping Services",
  tagline: "Your Cargo. Our Commitment.",
  description:
    "India's trusted international freight forwarder. Ocean freight, air cargo, customs clearance & warehousing to 50+ countries.",
  url: "https://sayonashipping.me",
  email: "sayonaexim@gmail.com",
  salesEmail: "sales@sayonashipping.com",
  phone: "+91-9790057690",
  phoneDisplay: "9790057690",
  whatsapp: "919790057690",
  address: {
    street: "HOUSE No. G, SF NO.637/3A , 637/3B, HILL VIEW APARTMENT, PUNITHA GARDEN, Somayampalayam Village",
    city: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    zip: "641041",
  },
  social: {
    linkedin: "https://linkedin.com/company/sayonashipping",
    twitter: "https://twitter.com/sayonashipping",
    facebook: "https://facebook.com/sayonashipping",
    instagram: "https://instagram.com/sayonashipping",
  },
  contactPerson: "Sathish Kumar",
  hours: "Mon - Fri: 8:00 AM - 6:00 PM",
  founded: "2020",
} as const;

// ─── Navigation ───
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Company", href: "/company" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICE_DROPDOWN = [
  {
    title: "Core Freight",
    items: [
      { label: "Ocean Freight (FCL/LCL)", href: "/services#fcl", icon: "Ship" },
      { label: "Air Freight", href: "/services#air-freight", icon: "Plane" },
      { label: "Ground Transportation", href: "/services#lcl", icon: "Truck" },
    ],
  },
  {
    title: "Specialized Solutions",
    items: [
      { label: "Warehousing", href: "/services#warehousing", icon: "Warehouse" },
      { label: "Customs Clearance", href: "/services#customs", icon: "FileSignature" },
      { label: "Supply Chain Logistics", href: "/services#lcl", icon: "PackageOpen" },
    ],
  },
] as const;

export const INDUSTRY_DROPDOWN = [
  { label: "Textile & Apparel", href: "/industries/textile", icon: "Shirt" },
  { label: "High-Tech & Electronics", href: "/industries/hightech", icon: "Cpu" },
  { label: "Pharmaceuticals", href: "/industries/pharma", icon: "HeartPulse" },
  { label: "Automotive", href: "/industries/automotive", icon: "Car" },
  { label: "Agri Products", href: "/industries/agri-products", icon: "Sprout" },
  { label: "General Cargo", href: "/industries/general-cargo", icon: "Boxes" },
] as const;

// ─── Services Data ───
export const SERVICES: ServiceData[] = [
  {
    id: "lcl",
    title: "LCL Shipments",
    icon: "Ship",
    description:
      "Cost-efficient shipping for smaller cargo volumes. Consolidation with other shipments reduces cost while maintaining reliable delivery schedules.",
    features: [
      "Cost sharing with other shippers",
      "Regular sailing schedules",
      "Flexible cargo volume",
      "Door-to-door or port-to-port",
    ],
    image: "/images/services/lcl-consolidation.jpg",
    href: "/services#lcl",
  },
  {
    id: "fcl",
    title: "FCL Shipments",
    icon: "Boxes",
    description:
      "Dedicated container shipping for large cargo. Maximum security, faster transit, and reduced handling risk.",
    features: [
      "Exclusive container use (20ft & 40ft)",
      "Direct transit without intermediate handling",
      "Sealed at origin, opened at destination",
      "Ideal for bulk goods and high volume",
    ],
    image: "/images/services/fcl-container-ship.jpg",
    href: "/services#fcl",
  },
  {
    id: "air-freight",
    title: "Air Freight Export",
    icon: "Plane",
    description:
      "Fast international delivery for urgent, high-value, or time-sensitive shipments. Global airline network coverage.",
    features: [
      "Express delivery options (24-72 hours)",
      "Door-to-door courier services",
      "Real-time flight tracking",
      "Secure handling for high-value goods",
    ],
    image: "/images/services/air.jpg",
    href: "/services#air-freight",
  },
  {
    id: "customs",
    title: "Customs Clearance",
    icon: "FileSignature",
    description:
      "Complete handling of export/import documentation, duty compliance, HS classification, and customs processing.",
    features: [
      "Documentation preparation (Invoice, Packing List)",
      "Duty & Tax calculation assistance",
      "Regulatory compliance checking",
      "Faster clearance to avoid demurrage",
    ],
    image: "/images/services/customs-clearance.jpg",
    href: "/services#customs",
  },
  {
    id: "warehousing",
    title: "Warehousing & Storage",
    icon: "Warehouse",
    description:
      "Secure cargo storage, inventory management, consolidation, and distribution support before export or after import.",
    features: [
      "Short & long-term storage options",
      "Cargo consolidation for LCL",
      "Inventory management systems",
      "Distribution and last-mile delivery",
    ],
    image: "/images/about/warehouse.jpg",
    href: "/services#warehousing",
  },
];

// ─── Industries Data ───
export const INDUSTRIES: IndustryData[] = [
  {
    slug: "textile",
    title: "Textile & Apparel",
    icon: "Shirt",
    description:
      "Specialized logistics for garments, fabrics, and fashion exports from India's textile hubs.",
    image: "/images/industries/textile.jpg",
  },
  {
    slug: "automotive",
    title: "Automotive",
    icon: "Car",
    description:
      "Precision transport for auto parts, engines, and components with full supply chain visibility.",
    image: "/images/industries/automotive.jpg",
  },
  {
    slug: "hightech",
    title: "High-Tech",
    icon: "Cpu",
    description:
      "Anti-static, shock-proof packaging and secure shipping for sensitive electronics.",
    image: "/images/industries/hightech.jpg",
  },
  {
    slug: "pharma",
    title: "Pharmaceuticals",
    icon: "HeartPulse",
    description:
      "GDP-compliant, temperature-controlled cold chain logistics for medicines and vaccines.",
    image: "/images/industries/pharma.jpg",
  },
  {
    slug: "agri-products",
    title: "Agri Products",
    icon: "Sprout",
    description:
      "Fast, safe transport for spices, grains, produce, and perishable agricultural exports.",
    image: "/images/industries/agri.jpg",
  },
  {
    slug: "general-cargo",
    title: "General Cargo",
    icon: "Boxes",
    description:
      "Reliable end-to-end shipping for all cargo types, volumes, and destinations worldwide.",
    image: "/images/industries/general-cargo.jpg",
  },
];

// ─── Stats ───
export const HOME_STATS: StatData[] = [
  { value: 500, suffix: "+", label: "Clients", icon: "Users" },
  { value: 10000, suffix: "+", label: "Shipments", icon: "PackageOpen" },
  { value: 25, suffix: "+", label: "Countries", icon: "Globe" },
  { value: 98, suffix: "%", label: "On-Time Rate", icon: "Timer" },
];

export const HERO_METRICS: StatData[] = [
  { value: 98, suffix: "%", label: "On-Time Delivery", icon: "Target" },
  { value: 50, suffix: "+", label: "Countries Served", icon: "Globe" },
  { value: 24, suffix: "/7", label: "Live Tracking", icon: "Radio" },
  { value: 500, suffix: "+", label: "Happy Clients", icon: "Users" },
];

// ─── Testimonials ───
export const TESTIMONIALS: TestimonialData[] = [
  {
    name: "Amith AC",
    role: "Export Manager",
    company: "Textile Co.",
    quote:
      "Sayona Shipping Services handles all our international logistics. Incredibly reliable and fast!",
    rating: 5,
    avatarColor: "info",
  },
  {
    name: "Prakashan",
    role: "Director",
    company: "Kerala Spices Ltd.",
    quote:
      "The best customs clearance team. We never have to worry about paperwork delays.",
    rating: 5,
    avatarColor: "success",
  },
  {
    name: "Megha",
    role: "Supply Chain Head",
    company: "AutoParts India",
    quote:
      "Excellent FCL rates and real-time tracking made our supply chain much smoother.",
    rating: 4.5,
    avatarColor: "primary",
  },
];

// ─── FAQs ───
export const FAQS: FAQData[] = [
  {
    question: "What regions do you provide shipping services for?",
    answer:
      "We provide comprehensive global shipping. From our hubs in India, we deliver to over 50 countries across North America, Europe, the Middle East, and Asia.",
  },
  {
    question: "Do you handle customs clearance directly?",
    answer:
      "Yes, we have an in-house team of customs clearance experts who handle all documentation, duty classification, and regulatory compliance at both origin and destination ports.",
  },
  {
    question: "How can I track my shipment?",
    answer:
      "You can use the Track Cargo tool available on our website. Simply enter your Waybill or Tracking ID to see real-time status and location updates.",
  },
  {
    question: "What is the difference between FCL and LCL?",
    answer:
      "FCL (Full Container Load) means you rent the entire container for your goods. LCL (Less than Container Load) means your goods share a container with other shipments, which is more cost-effective for smaller volumes.",
  },
];

// ─── Company Timeline ───
export const TIMELINE: TimelineEntry[] = [
  {
    year: "2020",
    title: "Foundation",
    description: "Established operations focusing on the textile export corridors.",
  },
  {
    year: "2022",
    title: "Digital Transition",
    description:
      "Launched advanced client portals and centralized tracking algorithms.",
  },
  {
    year: "2024",
    title: "Vertical Expansion",
    description:
      "Added critical capabilities for pharmaceutical and automotive transport.",
  },
  {
    year: "2026",
    title: "Global Networking",
    description: "Securing 15+ international strategic port alliances.",
  },
];

// ─── Locations ───
export const LOCATIONS: LocationData[] = [
  {
    name: "Chennai",
    icon: "Building2",
    description:
      "Central command and primary seaport gateway for deep-ocean freight control.",
    region: "Tamil Nadu, India",
    isHQ: true,
  },
  {
    name: "Bangalore",
    icon: "PlaneTakeoff",
    description:
      "Strategic hub for air freight operations and high-tech electronic component exports.",
    region: "Karnataka, India",
  },
  {
    name: "Tiruppur / Coimbatore",
    icon: "Factory",
    description:
      "Textile and manufacturing concentration for dedicated industrial consolidation.",
    region: "Tamil Nadu, India",
  },
];

// ─── Trust Signals ───
export const TRUST_SIGNALS = [
  {
    icon: "CheckCircle",
    title: "Quality Assured",
    description: "Standardized Operations",
  },
  {
    icon: "ShieldCheck",
    title: "Fully Insured",
    description: "End-to-end Coverage",
  },
  {
    icon: "Handshake",
    title: "500+ Clients",
    description: "Trusted Partnerships",
  },
  {
    icon: "Headset",
    title: "24/7 Support",
    description: "Dedicated Account Managers",
  },
] as const;

// ─── Careers ───
export const JOB_LISTINGS: JobListing[] = [
  {
    title: "Logistics Coordinator",
    location: "Tirupur, Tamil Nadu",
    type: "Full-time",
    department: "Operations",
  },
  {
    title: "Customs Compliance Officer",
    location: "Chennai, Tamil Nadu",
    type: "Full-time",
    department: "Compliance",
  },
  {
    title: "Business Development Executive",
    location: "Remote / Bangalore",
    type: "Full-time",
    department: "Sales",
  },
];

export const CAREER_PERKS: PerkData[] = [
  {
    icon: "TrendingUp",
    title: "Career Growth",
    description:
      "Fast-tracked promotions and clear career paths in a rapidly growing company.",
  },
  {
    icon: "Globe",
    title: "Global Exposure",
    description:
      "Work with international clients and partners across 50+ countries.",
  },
  {
    icon: "GraduationCap",
    title: "Learning & Development",
    description:
      "Continuous training programs and industry certification support.",
  },
  {
    icon: "Heart",
    title: "Work-Life Balance",
    description:
      "Flexible working hours, health insurance, and wellness programs.",
  },
];

// ─── Shipping Status Helpers ───
export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-[var(--color-status-created)] text-white",
  "picked up": "bg-[var(--color-status-picked)] text-white",
  "in transit": "bg-[var(--color-status-transit)] text-white",
  "at port": "bg-[var(--color-status-warehouse)] text-white",
  "arrived at destination": "bg-[var(--color-status-warehouse)] text-white",
  "customs clearance": "bg-[var(--color-status-out-delivery)] text-white",
  "out for delivery": "bg-[var(--color-status-out-delivery)] text-white",
  delivered: "bg-[var(--color-status-delivered)] text-white",
  failed: "bg-[var(--color-status-failed)] text-white",
  returned: "bg-[var(--color-status-returned)] text-white",
};

export const TRACKING_STAGES = [
  "Pending",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
] as const;

// ─── Industry Content ───
export const INDUSTRY_CONTENT: Record<
  string,
  { cargoTypes: string[]; certifications: string[]; keyFeatures: string[] }
> = {
  textile: {
    cargoTypes: ["Garments", "Fabrics", "Yarn", "Fashion Accessories"],
    certifications: ["AEO Certified", "ISO 9001:2015"],
    keyFeatures: [
      "Hangover garment containers for wrinkle-free delivery",
      "Humidity-controlled storage for fabric protection",
      "Direct connections to major textile ports worldwide",
      "Specialized packing for delicate fashion items",
    ],
  },
  automotive: {
    cargoTypes: ["Auto Parts", "Engines", "Components", "Accessories"],
    certifications: ["IATF 16949", "ISO 14001"],
    keyFeatures: [
      "Heavy-lift and oversized cargo handling",
      "Just-in-time delivery for production lines",
      "Secure shock-proof packaging solutions",
      "Full supply chain visibility and tracking",
    ],
  },
  hightech: {
    cargoTypes: ["Electronics", "Semiconductors", "IT Equipment", "Components"],
    certifications: ["TAPA FSR", "C-TPAT"],
    keyFeatures: [
      "Anti-static packaging and handling protocols",
      "Temperature-controlled transit options",
      "High-security chain of custody",
      "Express air freight for urgent shipments",
    ],
  },
  pharma: {
    cargoTypes: ["Medicines", "Vaccines", "Medical Devices", "APIs"],
    certifications: ["GDP Compliant", "WHO GMP"],
    keyFeatures: [
      "Cold chain logistics (2-8°C and -20°C)",
      "Real-time temperature monitoring",
      "Regulatory compliance documentation",
      "Validated packaging solutions",
    ],
  },
  "agri-products": {
    cargoTypes: ["Spices", "Grains", "Produce", "Tea & Coffee"],
    certifications: ["FSSAI", "Phytosanitary Compliance"],
    keyFeatures: [
      "Fumigation and pest control services",
      "Refrigerated container availability",
      "Bulk cargo and break-bulk handling",
      "Port-direct services from agricultural hubs",
    ],
  },
  "general-cargo": {
    cargoTypes: ["Mixed Goods", "Project Cargo", "Personal Effects", "Machinery"],
    certifications: ["ISO 9001", "Licensed CHA"],
    keyFeatures: [
      "Flexible container options (20ft, 40ft, Open Top)",
      "Door-to-door and port-to-port services",
      "Consolidation services for LCL",
      "Customs brokerage and documentation",
    ],
  },
};
