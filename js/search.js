/* ─── Live Site Search ─── */
(function () {
    /* ── Searchable content index ── */
    const searchIndex = [
        // Home page
        { title: "Home", url: "index.html", keywords: "home landing main page sayona shipping services", category: "Page" },
        { title: "Get a Free Quote", url: "index.html#quote", keywords: "quote request pricing estimate cost free", category: "Home" },
        { title: "Live Shipment Tracking", url: "index.html#tracking-demo", keywords: "track shipment live demo status tracking updates", category: "Home" },
        { title: "How It Works", url: "index.html#process", keywords: "process how it works booking consultation documentation delivery", category: "Home" },
        { title: "Industries We Serve", url: "index.html#industries", keywords: "industries textile electronics automotive cargo garments", category: "Home" },
        { title: "Our Clients & Testimonials", url: "index.html#testimonials", keywords: "testimonials reviews clients feedback ratings", category: "Home" },

        // Services
        { title: "Services", url: "services.html", keywords: "services ocean freight air shipping customs warehousing supply chain", category: "Page" },
        { title: "Ocean Freight (FCL/LCL)", url: "services.html#fcl", keywords: "ocean freight fcl full container load sea shipping maritime", category: "Services" },
        { title: "LCL Shipments", url: "services.html#lcl", keywords: "lcl less container load consolidation small cargo shipping", category: "Services" },
        { title: "Air Freight Export", url: "services.html#air-freight", keywords: "air freight export cargo fast delivery airline urgent", category: "Services" },
        { title: "Customs Clearance", url: "services.html#customs", keywords: "customs clearance documentation duty compliance hs classification import export", category: "Services" },
        { title: "Warehousing & Storage", url: "services.html#warehousing", keywords: "warehousing storage inventory management distribution consolidation", category: "Services" },
        { title: "Supply Chain Logistics", url: "services.html#lcl", keywords: "supply chain logistics management end to end solutions", category: "Services" },
        { title: "Ground Transportation", url: "services.html#lcl", keywords: "ground transportation truck road freight domestic", category: "Services" },

        // Tracking
        { title: "Track Your Shipment", url: "tracking.html", keywords: "tracking track shipment cargo status real time location updates", category: "Page" },

        // Company
        { title: "About Company", url: "company.html", keywords: "about company history mission vision team who we are", category: "Page" },
        { title: "Our Presence", url: "company.html#presence", keywords: "global presence locations offices worldwide network", category: "Company" },

        // Contact
        { title: "Contact Us", url: "contact.html", keywords: "contact us reach phone email address form message enquiry", category: "Page" },
        { title: "Request a Quote", url: "contact.html#quote", keywords: "quote request pricing contact form shipment details estimate", category: "Contact" },

        // Careers
        { title: "Careers", url: "careers.html", keywords: "careers jobs hiring positions openings work with us employment", category: "Page" },

        // Industries
        { title: "Textile & Apparel", url: "/industries/textile.html", keywords: "textile apparel garments fabrics yarn made-ups home textiles clothing fashion cotton polyester", category: "Industries" },
        { title: "High-Tech & Electronics", url: "/industries/hightech.html", keywords: "high tech electronics technology gadgets consumer smartphones semiconductors", category: "Industries" },
        { title: "Pharmaceuticals", url: "/industries/pharma.html", keywords: "pharma pharmaceuticals medicine healthcare cold chain temperature GDP vaccines", category: "Industries" },
        { title: "Automotive", url: "/industries/automotive.html", keywords: "automotive car parts vehicle CKD SKD EV battery spare parts components", category: "Industries" },
        { title: "Agri Products", url: "/industries/agri-products.html", keywords: "agriculture farming food grains spices rice wheat produce exports cold chain", category: "Industries" },
        { title: "General Cargo", url: "/industries/general-cargo.html", keywords: "general cargo raw materials accessories bulk commodities consumer goods industrial equipment", category: "Industries" },

        // Client Portal
        { title: "Client Login", url: "/client/login.html", keywords: "client login portal sign in account access", category: "Portal" },
        { title: "Client Registration", url: "/client/register.html", keywords: "client register sign up create account new", category: "Portal" },
        { title: "Client Dashboard", url: "/client/dashboard.html", keywords: "dashboard client overview panel shipments summary", category: "Portal" },
        { title: "My Shipments", url: "/client/shipments.html", keywords: "my shipments orders history list status client", category: "Portal" },
        { title: "Track Shipment", url: "/client/track.html", keywords: "track client portal shipment live updates", category: "Portal" },
    ];

    /* ── Category icons ── */
    const catIcons = {
        Page: "fas fa-file-alt",
        Home: "fas fa-home",
        Services: "fas fa-ship",
        Company: "fas fa-building",
        Contact: "fas fa-envelope",
        Industries: "fas fa-industry",
        Portal: "fas fa-user-circle",
    };

    /* ── Build overlay HTML ── */
    function createOverlay() {
        if (document.getElementById("search-overlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "search-overlay";
        overlay.innerHTML = `
      <div class="search-overlay-backdrop"></div>
      <div class="search-modal">
        <div class="search-header">
          <i class="fas fa-search search-input-icon"></i>
          <input type="text" id="search-input" placeholder="Search pages, services, tracking..." autocomplete="off" />
          <kbd class="search-kbd">ESC</kbd>
          <button class="search-close-btn" aria-label="Close search"><i class="fas fa-times"></i></button>
        </div>
        <div id="search-results" class="search-results">
          <div class="search-empty-state">
            <i class="fas fa-compass"></i>
            <p>Start typing to search across the entire site</p>
          </div>
        </div>
        <div class="search-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Open</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    `;
        document.body.appendChild(overlay);

        // Bind events
        const input = document.getElementById("search-input");
        const resultsContainer = document.getElementById("search-results");
        const backdrop = overlay.querySelector(".search-overlay-backdrop");
        const closeBtn = overlay.querySelector(".search-close-btn");

        input.addEventListener("input", () => performSearch(input.value.trim(), resultsContainer));

        backdrop.addEventListener("click", closeSearch);
        closeBtn.addEventListener("click", closeSearch);

        document.addEventListener("keydown", handleKeyboard);
    }

    let activeIndex = -1;

    function handleKeyboard(e) {
        const overlay = document.getElementById("search-overlay");
        if (!overlay) return;

        if (e.key === "Escape") {
            closeSearch();
            return;
        }

        if (!overlay.classList.contains("active")) return;

        const items = overlay.querySelectorAll(".search-result-item");
        if (!items.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, items.length - 1);
            updateActiveItem(items);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            updateActiveItem(items);
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            items[activeIndex].click();
        }
    }

    function updateActiveItem(items) {
        items.forEach((item, i) => {
            item.classList.toggle("active", i === activeIndex);
        });
        if (items[activeIndex]) {
            items[activeIndex].scrollIntoView({ block: "nearest" });
        }
    }

    /* ── Fuzzy-ish search ── */
    function performSearch(query, container) {
        activeIndex = -1;
        if (!query) {
            container.innerHTML = `
        <div class="search-empty-state">
          <i class="fas fa-compass"></i>
          <p>Start typing to search across the entire site</p>
        </div>`;
            return;
        }

        const q = query.toLowerCase();
        const words = q.split(/\s+/);

        const scored = searchIndex
            .map((item) => {
                const haystack = (item.title + " " + item.keywords + " " + item.category).toLowerCase();
                let score = 0;
                for (const w of words) {
                    if (haystack.includes(w)) score++;
                }
                // Boost exact title matches
                if (item.title.toLowerCase().includes(q)) score += 3;
                return { ...item, score };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        if (!scored.length) {
            container.innerHTML = `
        <div class="search-empty-state">
          <i class="fas fa-search"></i>
          <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
        </div>`;
            return;
        }

        container.innerHTML = scored
            .map(
                (item, idx) => `
        <a href="${item.url}" class="search-result-item" data-idx="${idx}">
          <div class="search-result-icon"><i class="${catIcons[item.category] || "fas fa-link"}"></i></div>
          <div class="search-result-text">
            <span class="search-result-title">${highlightMatch(item.title, q)}</span>
            <span class="search-result-cat">${item.category}</span>
          </div>
          <i class="fas fa-arrow-right search-result-arrow"></i>
        </a>`
            )
            .join("");
    }

    function highlightMatch(text, query) {
        const idx = text.toLowerCase().indexOf(query);
        if (idx < 0) return escapeHtml(text);
        return (
            escapeHtml(text.slice(0, idx)) +
            '<mark>' + escapeHtml(text.slice(idx, idx + query.length)) + '</mark>' +
            escapeHtml(text.slice(idx + query.length))
        );
    }

    function escapeHtml(str) {
        const el = document.createElement("span");
        el.textContent = str;
        return el.innerHTML;
    }

    /* ── Open / Close ── */
    function openSearch() {
        createOverlay();
        const overlay = document.getElementById("search-overlay");
        // Small timeout for transition
        requestAnimationFrame(() => {
            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
            const input = document.getElementById("search-input");
            input.value = "";
            input.focus();
            performSearch("", document.getElementById("search-results"));
        });
    }

    function closeSearch() {
        const overlay = document.getElementById("search-overlay");
        if (!overlay) return;
        overlay.classList.remove("active");
        document.body.style.overflow = "";
        activeIndex = -1;
    }

    /* ── Bind to all .nav-search-btn on page ── */
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".nav-search-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                openSearch();
            });
        });

        // Also allow Cmd/Ctrl + K shortcut
        document.addEventListener("keydown", (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                const overlay = document.getElementById("search-overlay");
                if (overlay && overlay.classList.contains("active")) {
                    closeSearch();
                } else {
                    openSearch();
                }
            }
        });
    });
})();
