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
import { Button } from "@/components/ui/button";

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
      {/* ─── Floating 2026 Enterprise Glass Navbar ─── */}
      <header className="sticky top-0 z-[var(--z-navbar)] pt-3 pb-2 px-4 sm:px-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Single Unified Floating Glass Bar */}
          <nav
            className={cn(
              "relative flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 rounded-full transition-all duration-500",
              "bg-[#040e21]/80 dark:bg-[#040e21]/90 backdrop-blur-2xl border border-white/[0.14]",
              "shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]",
              scrolled && "shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] bg-[#030917]/95"
            )}
          >
            {/* ═══ Left: Brand Logo ═══ */}
            <div className="shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full ring-1 ring-white/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/sayona-logo.png"
                    alt="Sayona Shipping Services"
                    width={130}
                    height={36}
                    className="h-7 w-auto object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* ═══ Center: Desktop Nav Links ═══ */}
            <ul className="hidden lg:flex items-center gap-1">
              {/* Home */}
              <li>
                <Link
                  href="/"
                  className={cn(
                    "relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
                    pathname === "/"
                      ? "text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/15"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  Home
                </Link>
              </li>

              {/* Services Dropdown */}
              <li
                className="relative"
                onMouseEnter={() => openDropdown("services")}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer",
                    pathname.startsWith("/services") || activeDropdown === "services"
                      ? "text-white bg-white/10 border border-white/15"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  )}
                  aria-expanded={activeDropdown === "services"}
                >
                  Services
                  <ChevronDown className={cn("h-3.5 w-3.5 text-accent transition-transform duration-300", activeDropdown === "services" && "rotate-180")} />
                </button>

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {activeDropdown === "services" && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] bg-[#071a33]/95 backdrop-blur-3xl border border-white/15 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-4 grid grid-cols-2 gap-4 z-50 overflow-hidden"
                      onMouseEnter={() => openDropdown("services")}
                      onMouseLeave={closeDropdown}
                    >
                      {/* Glow background accent */}
                      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

                      {SERVICE_DROPDOWN.map((group) => (
                        <div key={group.title} className="relative z-10">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-accent mb-2 px-2.5">
                            {group.title}
                          </p>
                          <div className="space-y-1">
                            {group.items.map((item) => {
                              const Icon = serviceIconMap[item.icon] || Ship;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/[0.08] transition-all duration-200 group/item"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 group-hover/item:bg-accent group-hover/item:text-secondary transition-colors">
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
              </li>

              {/* Company */}
              <li>
                <Link
                  href="/company"
                  className={cn(
                    "relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
                    pathname === "/company"
                      ? "text-white bg-white/10 border border-white/15"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  Company
                </Link>
              </li>

              {/* Industries Dropdown */}
              <li
                className="relative"
                onMouseEnter={() => openDropdown("industries")}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer",
                    pathname.startsWith("/industries") || activeDropdown === "industries"
                      ? "text-white bg-white/10 border border-white/15"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  )}
                  aria-expanded={activeDropdown === "industries"}
                >
                  Industries
                  <ChevronDown className={cn("h-3.5 w-3.5 text-accent transition-transform duration-300", activeDropdown === "industries" && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {activeDropdown === "industries" && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[300px] bg-[#071a33]/95 backdrop-blur-3xl border border-white/15 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-3 z-50 overflow-hidden"
                      onMouseEnter={() => openDropdown("industries")}
                      onMouseLeave={closeDropdown}
                    >
                      <div className="space-y-1 relative z-10">
                        {INDUSTRY_DROPDOWN.map((item) => {
                          const Icon = industryIconMap[item.icon] || Boxes;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/[0.08] transition-all duration-200 group/item"
                            >
                              <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 group-hover/item:bg-accent group-hover/item:text-secondary transition-colors">
                                <Icon className="h-3.5 w-3.5 text-accent group-hover/item:text-secondary" />
                              </div>
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* Contact */}
              <li>
                <Link
                  href="/contact"
                  className={cn(
                    "relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
                    pathname === "/contact"
                      ? "text-white bg-white/10 border border-white/15"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  Contact
                </Link>
              </li>

              {/* Nav Agent Trigger */}
              <li className="ml-1">
                <button
                  onClick={dispatchAgentCommand}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 text-xs font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  title="Launch AI Navigation Assistant"
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                  <span>Nav Agent</span>
                  <kbd className="px-1.5 py-0.5 text-[9px] font-sans bg-black/40 text-accent/90 rounded border border-accent/30 font-bold">⌘K</kbd>
                </button>
              </li>
            </ul>

            {/* ═══ Right: Actions (Desktop) ═══ */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/client/login">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                  <User className="h-3.5 w-3.5 text-accent" />
                  Client Portal
                </button>
              </Link>

              <Link href="/tracking">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  Track Cargo
                </button>
              </Link>

              <Link href="/contact#quote">
                <button className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider text-secondary bg-gradient-to-r from-accent via-amber-500 to-amber-600 hover:from-amber-400 hover:to-accent shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer sheen overflow-hidden">
                  <span>Get Quote</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>

              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Toggle dark mode"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
                </button>
              )}
            </div>

            {/* ═══ Mobile Hamburger Button ═══ */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={dispatchAgentCommand}
                className="p-2 rounded-full bg-accent/15 text-accent border border-accent/30"
              >
                <Sparkles className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6 text-accent" /> : <Menu className="h-6 w-6 text-white" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ─── Mobile Drawer Menu ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-20 z-[999] bg-[#071a33]/98 backdrop-blur-3xl border border-white/15 rounded-3xl p-6 shadow-[0_30px_80px_rgba(0,0,0,0.8)] lg:hidden overflow-y-auto max-h-[85vh]"
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-colors",
                  pathname === "/" ? "text-accent bg-white/10" : "text-white/80 hover:bg-white/5"
                )}
              >
                Home
              </Link>

              {/* Mobile Services Accordion */}
              <button
                onClick={() => setMobileExpanded(mobileExpanded === "services" ? null : "services")}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-white/80 hover:bg-white/5 cursor-pointer"
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
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden pl-4 space-y-1"
                  >
                    {SERVICE_DROPDOWN.map((g) => g.items.map((item) => {
                      const Icon = serviceIconMap[item.icon] || Ship;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10"
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
                  "px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-colors",
                  pathname === "/company" ? "text-accent bg-white/10" : "text-white/80 hover:bg-white/5"
                )}
              >
                Company
              </Link>

              {/* Mobile Industries Accordion */}
              <button
                onClick={() => setMobileExpanded(mobileExpanded === "industries" ? null : "industries")}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-white/80 hover:bg-white/5 cursor-pointer"
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
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden pl-4 space-y-1"
                  >
                    {INDUSTRY_DROPDOWN.map((item) => {
                      const Icon = industryIconMap[item.icon] || Boxes;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10"
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
                  "px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-colors",
                  pathname === "/contact" ? "text-accent bg-white/10" : "text-white/80 hover:bg-white/5"
                )}
              >
                Contact
              </Link>

              <div className="h-px bg-white/10 my-3" />

              <div className="grid grid-cols-2 gap-2">
                <Link href="/tracking">
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white text-xs font-bold border border-white/10">
                    <MapPin className="h-4 w-4 text-accent" /> Track Cargo
                  </button>
                </Link>
                <Link href="/client/login">
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white text-xs font-bold border border-white/10">
                    <User className="h-4 w-4 text-accent" /> Client Portal
                  </button>
                </Link>
              </div>

              <Link href="/contact#quote" className="mt-2">
                <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-accent to-amber-500 text-secondary text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)]">
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
