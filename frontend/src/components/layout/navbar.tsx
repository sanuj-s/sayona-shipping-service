"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Menu, X, Sun, Moon, Sparkles, Navigation,
  MapPin, User, Search, Phone, Mail, Clock
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SITE, NAV_LINKS, SERVICE_DROPDOWN, INDUSTRY_DROPDOWN } from "@/lib/utils/constants";
import { useUIStore } from "@/lib/store/ui-store";
import { Button } from "@/components/ui/button";

const dispatchAgentCommand = () => {
  window.dispatchEvent(new CustomEvent("open-agentic-command"));
};

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  const navBg = scrolled || !isHome
    ? "bg-[var(--nav-bg)]/90 backdrop-blur-xl shadow-[var(--shadow-nav)] border-b border-[var(--border-color)]"
    : "bg-transparent border-b border-white/10";

  const textColor = !scrolled && isHome ? "text-white" : "text-[var(--foreground)]";

  return (
    <>
      {/* ─── Top Utility Bar ─── */}
      <div className={cn(
        "hidden lg:block text-xs py-2 border-b transition-colors duration-300",
        !scrolled && isHome
          ? "bg-secondary/80 backdrop-blur border-white/10 text-white/80"
          : "bg-[var(--background-alt)] border-[var(--border-color)] text-[var(--foreground-secondary)]"
      )}>
        <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {SITE.phoneDisplay}</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {SITE.email}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {SITE.hours}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
            <div className="w-px h-4 bg-current opacity-20" />
            <Link href="/client/login" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <User className="h-3 w-3" /> Client Portal
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Main Navbar ─── */}
      <nav className={cn(
        "sticky top-0 z-[var(--z-navbar)] transition-all duration-300",
        navBg
      )}>
        <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <img
              src="/images/sayona-logo.png"
              alt="Sayona Shipping Services"
              width={160}
              height={44}
              className={cn(
                "h-10 w-auto object-contain transition-all",
                !scrolled && isHome
                  ? "brightness-0 invert"
                  : "dark:brightness-0 dark:invert"
              )}
            />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-[var(--duration-normal)]",
                    pathname === link.href
                      ? "text-primary"
                      : cn(textColor, "hover:text-primary")
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Agentic Command Trigger */}
            <li className="ml-2">
              <button
                onClick={dispatchAgentCommand}
                data-magnetic
                className="group flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm transition-all hover:bg-primary/20 backdrop-blur-md border border-primary/20 shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Nav Agent</span>
                <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-sans bg-primary/10 rounded border border-primary/20">⌘K</kbd>
              </button>
            </li>
          </ul>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/tracking">
              <Button variant="ghost" size="sm">
                <MapPin className="h-4 w-4" /> Track Cargo
              </Button>
            </Link>
            <Link href="/contact#quote">
              <Button variant="enterprise" size="sm">Get Quote</Button>
            </Link>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "p-2 rounded-lg transition-colors cursor-pointer",
                  textColor, "hover:bg-primary/5"
                )}
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn("lg:hidden p-2 rounded-lg transition-colors cursor-pointer", textColor)}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-[72px] z-[999] bg-[var(--surface)] lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col p-6 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-[var(--foreground)] hover:bg-primary/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/services" className="px-4 py-3 rounded-lg text-base font-medium text-[var(--foreground)] hover:bg-primary/5">
                Services
              </Link>
              <Link href="/tracking" className="px-4 py-3 rounded-lg text-base font-medium text-[var(--foreground)] hover:bg-primary/5">
                Tracking
              </Link>
              <Link href="/careers" className="px-4 py-3 rounded-lg text-base font-medium text-[var(--foreground)] hover:bg-primary/5">
                Careers
              </Link>

              <div className="h-px bg-[var(--border-color)] my-4" />

              <Link href="/tracking" className="w-full">
                <Button variant="ghost" className="w-full justify-center">
                  <MapPin className="h-4 w-4" /> Track Cargo
                </Button>
              </Link>
              <Link href="/contact#quote" className="w-full mt-2">
                <Button variant="enterprise" className="w-full justify-center">Get Quote</Button>
              </Link>

              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-[var(--foreground)] hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
