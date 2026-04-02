/**
 * Sayona Shipping — Shared Navbar Component
 * Injects top utility bar + corporate navbar + mobile menu
 * Usage: <div id="navbar-placeholder"></div>
 *        <script>window.SAYONA_BASE = '';</script>  // or '../' for subdirectory pages
 *        <script src="components/navbar.js"></script>
 */
(function () {
  const base = window.SAYONA_BASE || '';

  const html = `
    <!-- Top Utility Bar -->
    <div class="top-bar">
      <div class="top-bar-container">
        <div class="top-bar-left">
          <span><i class="fas fa-phone-alt"></i> 9790057690</span>
          <span><i class="fas fa-envelope"></i> sayonaexim@gmail.com</span>
          <span><i class="fas fa-clock"></i> Mon - Fri: 8:00 AM - 6:00 PM</span>
        </div>
        <div class="top-bar-right">
          <a href="https://linkedin.com/company/sayonashipping" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin-in"></i></a>
          <a href="https://twitter.com/sayonashipping" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>
          <a href="https://facebook.com/sayonashipping" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a>
          <div class="vertical-divider"></div>
          <a href="${base}client/login.html" class="client-login"><i class="fas fa-user-circle"></i> Client Portal</a>
        </div>
      </div>
    </div>

    <!-- Main Corporate Navbar -->
    <nav class="navbar corporate-nav">
      <div class="nav-left">
        <div class="logo">
          <a href="${base}index.html">
            <img src="${base}images/sayona-logo.png" alt="Sayona Shipping Services">
          </a>
        </div>
        <ul class="nav-links">
          <li><a href="${base}index.html">Home</a></li>
          <li class="dropdown-parent">
            <a href="${base}index.html#services">Services <i class="fas fa-chevron-down nav-caret"></i></a>
            <div class="dropdown-menu mega-menu">
              <div class="mega-column">
                <h4>Core Freight</h4>
                <a href="${base}services.html#fcl"><i class="fas fa-ship"></i> Ocean Freight (FCL/LCL)</a>
                <a href="${base}services.html#air-freight"><i class="fas fa-plane"></i> Air Freight</a>
                <a href="${base}services.html#lcl"><i class="fas fa-truck"></i> Ground Transportation</a>
              </div>
              <div class="mega-column">
                <h4>Specialized Solutions</h4>
                <a href="${base}services.html#warehousing"><i class="fas fa-warehouse"></i> Warehousing</a>
                <a href="${base}services.html#customs"><i class="fas fa-file-signature"></i> Customs Clearance</a>
                <a href="${base}services.html#lcl"><i class="fas fa-box-open"></i> Supply Chain Logistics</a>
              </div>
            </div>
          </li>
          <li class="dropdown-parent">
            <a href="${base}index.html#industries">Industries <i class="fas fa-chevron-down nav-caret"></i></a>
            <ul class="dropdown-menu simple-menu">
              <li><a href="${base}industries/textile.html"><i class="fas fa-tshirt"></i> Textile &amp; Apparel</a></li>
              <li><a href="${base}industries/hightech.html"><i class="fas fa-laptop"></i> High-Tech &amp; Electronics</a></li>
              <li><a href="${base}industries/pharma.html"><i class="fas fa-heartbeat"></i> Pharmaceuticals</a></li>
              <li><a href="${base}industries/automotive.html"><i class="fas fa-car"></i> Automotive</a></li>
              <li><a href="${base}industries/agri-products.html"><i class="fas fa-leaf"></i> Agri Products</a></li>
              <li><a href="${base}industries/general-cargo.html"><i class="fas fa-boxes"></i> General Cargo</a></li>
            </ul>
          </li>
          <li><a href="${base}company.html">Company</a></li>
          <li><a href="${base}contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="nav-right">
        <div class="nav-actions">
          <a href="${base}client/login.html" class="btn-ghost"><i class="fas fa-user-circle"></i> Client Portal</a>
          <a href="${base}tracking.html" class="btn-outline"><i class="fas fa-map-marker-alt"></i> Track Cargo</a>
          <a href="${base}contact.html#quote" class="btn-enterprise">Get Quote</a>
          <button id="darkModeToggle" class="dark-mode-toggle" aria-label="Toggle dark mode">🌙</button>
        </div>
        <button id="menuBtn" class="mobile-menu-btn" aria-label="Open menu">☰</button>
      </div>

      <!-- Mobile Menu Overlay -->
      <nav id="navMenu">
        <a href="${base}index.html">Home</a>
        <a href="${base}services.html">Services</a>
        <a href="${base}index.html#industries">Industries</a>
        <a href="${base}tracking.html">Tracking</a>
        <a href="${base}company.html">Company</a>
        <a href="${base}contact.html">Contact</a>
        <a href="${base}client/login.html">Client Portal</a>
        <hr />
        <a href="${base}tracking.html" class="btn-ghost mobile-btn">Track Cargo</a>
        <a href="${base}contact.html#quote" class="btn-enterprise mobile-btn">Get Quote</a>
      </nav>
    </nav>`;

  const placeholder = document.getElementById('navbar-placeholder');
  if (placeholder) {
    placeholder.innerHTML = html;
  }
})();
