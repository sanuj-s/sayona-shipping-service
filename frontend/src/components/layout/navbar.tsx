"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import {
  Menu, X, Sun, Moon, Sparkles,
  MapPin, User, ChevronDown, Ship, Plane, Truck, Warehouse, FileSignature, PackageOpen,
  Shirt, Cpu, HeartPulse, Car, Sprout, Boxes, ArrowRight, Send,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SERVICE_DROPDOWN, INDUSTRY_DROPDOWN } from "@/lib/utils/constants";
import { useUIStore } from "@/lib/store/ui-store";

const dispatchAgentCommand = () => {
  window.dispatchEvent(new CustomEvent("open-agentic-command"));
};

const serviceIconMap: Record<string, React.ElementType> = {
  Ship, Plane, Truck, Warehouse, FileSignature, PackageOpen,
};
const industryIconMap: Record<string, React.ElementType> = {
  Shirt, Cpu, HeartPulse, Car, Sprout, Boxes,
};

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    setActiveDropdown(null);
  }, [pathname, closeMobileMenu]);

  const openDropdown = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 180);
  };

  return (
    <>
      {/* ─── Ultra-Clean Enterprise Header (Seamless Overlay) ─── */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-[var(--z-navbar)] transition-all duration-300",
          scrolled
            ? "bg-[#020d1f]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-gradient-to-b from-[#020d1f]/90 via-[#020d1f]/50 to-transparent backdrop-blur-sm py-4 border-b border-white/[0.06]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">

            {/* ═══ Left: Brand Logo ═══ */}
            <div className="shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="bg-white px-3.5 py-1.5 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/sayona-logo.png"
                    alt="Sayona Shipping Services"
                    width={130}
                    height={36}
                    className="h-8 w-auto object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* ═══ Center: Navigation Links ═══ */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Home */}
              <Link
                href="/"
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  pathname === "/"
                    ? "text-white bg-white/10 font-bold"
                    : "text-white/75 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => openDropdown("services")}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                    pathname.startsWith("/services") || activeDropdown === "services"
                      ? "text-white bg-white/10 font-bold"
                      : "text-white/75 hover:text-white hover:bg-white/[0.06]"
                  )}
                  aria-expanded={activeDropdown === "services"}
                >
                  Services
                  <ChevronDown className={cn("h-4 w-4 text-accent transition-transform duration-300", activeDropdown === "services" && "rotate-180")} />
                </button>

                {/* Services Dropdown Panel */}
                <AnimatePresence>
                  {activeDropdown === "services" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 mt-2 w-[480px] bg-[#071a33]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 grid grid-cols-2 gap-4 z-50"
                      onMouseEnter={() => openDropdown("services")}
                      onMouseLeave={closeDropdown}
                    >
                      {SERVICE_DROPDOWN.map((group) => (
                        <div key={group.title}>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-accent mb-2 px-2">
                            {group.title}
                          </p>
                          <div className="space-y-0.5">
                            {group.items.map((item) => {
                              const Icon = serviceIconMap[item.icon] || Ship;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors group/item"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 group-hover/item:bg-accent transition-colors">
                                    <Icon className="h-3.5 w-3.5 text-accent group-hover/item:text-secondary" />
                                  </div>
                                  <span>{item.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Company */}
              <Link
                href="/company"
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  pathname === "/company"
                    ? "text-white bg-white/10 font-bold"
                    : "text-white/75 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                Company
              </Link>

              {/* Industries Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => openDropdown("industries")}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                    pathname.startsWith("/industries") || activeDropdown === "industries"
                      ? "text-white bg-white/10 font-bold"
                      : "text-white/75 hover:text-white hover:bg-white/[0.06]"
                  )}
                  aria-expanded={activeDropdown === "industries"}
                >
                  Industries
                  <ChevronDown className={cn("h-4 w-4 text-accent transition-transform duration-300", activeDropdown === "industries" && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {activeDropdown === "industries" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 mt-2 w-[280px] bg-[#071a33]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-3 z-50 space-y-0.5"
                      onMouseEnter={() => openDropdown("industries")}
                      onMouseLeave={closeDropdown}
                    >
                      {INDUSTRY_DROPDOWN.map((item) => {
                        const Icon = industryIconMap[item.icon] || Boxes;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors group/item"
                          >
                            <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 group-hover/item:bg-accent transition-colors">
                              <Icon className="h-3.5 w-3.5 text-accent group-hover/item:text-secondary" />
                            </div>
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact */}
              <Link
                href="/contact"
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  pathname === "/contact"
                    ? "text-white bg-white/10 font-bold"
                    : "text-white/75 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                Contact
              </Link>
            </nav>

            {/* ═══ Right: Actions ═══ */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Nav Agent AI Button */}
              <button
                onClick={dispatchAgentCommand}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 text-xs font-bold transition-all duration-200 cursor-pointer"
                title="Launch AI Navigation Assistant"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                <span>Nav Agent</span>
                <kbd className="px-1.5 py-0.5 text-[9px] font-sans bg-black/40 text-accent/90 rounded border border-accent/30">⌘K</kbd>
              </button>

              <Link href="/client/login">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                  <User className="h-3.5 w-3.5 text-accent" />
                  Client Portal
                </button>
              </Link>

              <Link href="/tracking">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  Track Cargo
                </button>
              </Link>

              {/* Get Quote CTA */}
              <Link href="/contact#quote">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-secondary bg-accent hover:bg-accent-hover shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-all duration-200 cursor-pointer">
                  <span>Get Quote</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>

              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Toggle dark mode"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-white" />}
                </button>
              )}
            </div>

            {/* ═══ Mobile Hamburger ═══ */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={dispatchAgentCommand}
                className="p-2 rounded-xl bg-accent/15 text-accent border border-accent/30"
              >
                <Sparkles className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6 text-accent" /> : <Menu className="h-6 w-6 text-white" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ─── Mobile Menu Drawer ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-[999] bg-[#071a33]/98 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-[0_30px_80px_rgba(0,0,0,0.8)] lg:hidden overflow-y-auto max-h-[85vh]"
          >
            <div className="flex flex-col gap-1.5">
              <Link
                href="/"
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname === "/" ? "text-accent bg-white/10 font-bold" : "text-white/80 hover:bg-white/5"
                )}
              >
                Home
              </Link>

              {/* Mobile Services */}
              <button
                onClick={() => setMobileExpanded(mobileExpanded === "services" ? null : "services")}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/5 cursor-pointer"
              >
                <span>Services</span>
                <ChevronDown className={cn("h-4 w-4 text-accent transition-transform", mobileExpanded === "services" && "rotate-180")} />
              </button>
              <AnimatePresence>
                {mobileExpanded === "services" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-4 space-y-1"
                  >
                    {SERVICE_DROPDOWN.map((g) => g.items.map((item) => {
                      const Icon = serviceIconMap[item.icon] || Ship;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Icon className="h-4 w-4 text-accent" />
                          {item.label}
                        </Link>
                      );
                    }))}
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href="/company"
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname === "/company" ? "text-accent bg-white/10 font-bold" : "text-white/80 hover:bg-white/5"
                )}
              >
                Company
              </Link>

              {/* Mobile Industries */}
              <button
                onClick={() => setMobileExpanded(mobileExpanded === "industries" ? null : "industries")}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/5 cursor-pointer"
              >
                <span>Industries</span>
                <ChevronDown className={cn("h-4 w-4 text-accent transition-transform", mobileExpanded === "industries" && "rotate-180")} />
              </button>
              <AnimatePresence>
                {mobileExpanded === "industries" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-4 space-y-1"
                  >
                    {INDUSTRY_DROPDOWN.map((item) => {
                      const Icon = industryIconMap[item.icon] || Boxes;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Icon className="h-4 w-4 text-accent" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href="/contact"
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname === "/contact" ? "text-accent bg-white/10 font-bold" : "text-white/80 hover:bg-white/5"
                )}
              >
                Contact
              </Link>

              <div className="h-px bg-white/10 my-2" />

              <div className="grid grid-cols-2 gap-2">
                <Link href="/tracking">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-white text-xs font-bold border border-white/10">
                    <MapPin className="h-4 w-4 text-accent" /> Track Cargo
                  </button>
                </Link>
                <Link href="/client/login">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-white text-xs font-bold border border-white/10">
                    <User className="h-4 w-4 text-accent" /> Client Portal
                  </button>
                </Link>
              </div>

              <Link href="/contact#quote" className="mt-2">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-secondary text-xs font-bold uppercase tracking-wider">
                  <span>Get Free Quote</span>
                  <Send className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
