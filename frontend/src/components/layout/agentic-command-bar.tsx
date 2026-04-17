"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, Ship, Box, MapPin, Building2 } from "lucide-react";
import { useHaptic } from "@/lib/hooks/use-haptic";

export function AgenticCommandBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { vibrate } = useHaptic();
  
  // Custom store or event listener can also toggle this
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => {
          if (!open) window.dispatchEvent(new CustomEvent("play-luxury-thud"));
          return !open;
        });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Listen to custom custom event if triggered from navbar
  useEffect(() => {
    const handleCommandOpen = () => {
      setOpen(true);
      window.dispatchEvent(new CustomEvent("play-luxury-thud"));
    };
    window.addEventListener("open-agentic-command", handleCommandOpen);
    return () => window.removeEventListener("open-agentic-command", handleCommandOpen);
  }, []);

  const runCommand = (command: () => void) => {
    vibrate("click");
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center pt-[15vh]">
      {/* Heavy 3D glass backdrop */}
      <div 
        className="absolute inset-0 bg-secondary/40 backdrop-blur-md" 
        onClick={() => setOpen(false)}
      />
      
      <div className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border-color)] shadow-[var(--shadow-elevated)] rounded-2xl overflow-hidden glass-3d">
        <Command label="Global Command Menu" className="w-full flex flex-col bg-transparent">
          
          <div className="flex items-center px-4 border-b border-[var(--border-color)]">
            <Search className="h-5 w-5 text-primary" />
            <Command.Input 
              placeholder="Ask me anything... (e.g. 'Track my cargo' or 'Find sea freight')" 
              className="w-full bg-transparent border-0 outline-none focus:ring-0 px-4 py-5 text-lg text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)]"
            />
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
            <Command.Empty className="py-6 text-center text-sm text-[var(--foreground-secondary)]">
              No intelligent matches found.
            </Command.Empty>

            <Command.Group heading="Anticipated Actions" className="px-2 py-3 text-xs font-semibold text-[var(--foreground-secondary)]">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/tracking"))}
                className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors text-sm font-medium text-[var(--foreground)]"
              >
                <MapPin className="h-4 w-4" /> Track my cargo
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/contact#quote"))}
                className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors text-sm font-medium text-[var(--foreground)]"
              >
                <Box className="h-4 w-4" /> Get a high-volume freight quote
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Logistics Core" className="px-2 py-2 text-xs font-semibold text-[var(--foreground-secondary)]">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/services/ocean-freight"))}
                className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors text-sm font-medium text-[var(--foreground)]"
              >
                <Ship className="h-4 w-4" /> Ocean Freight Services
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/company"))}
                className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors text-sm font-medium text-[var(--foreground)]"
              >
                <Building2 className="h-4 w-4" /> Company Global Network
              </Command.Item>
            </Command.Group>
            
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
