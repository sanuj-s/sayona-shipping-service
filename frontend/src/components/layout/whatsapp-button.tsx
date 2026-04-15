import { SITE } from "@/lib/utils/constants";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 lg:bottom-6 right-5 z-[var(--z-mobile-cta)] w-14 h-14 rounded-full bg-[var(--color-whatsapp)] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-whatsapp-pulse"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
