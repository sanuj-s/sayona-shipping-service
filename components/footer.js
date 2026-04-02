/**
 * Sayona Shipping — Shared Footer Component
 * Injects full footer HTML with all columns + social links
 * Usage: <div id="footer-placeholder"></div>
 * Requires window.SAYONA_BASE to be set before this script loads.
 */
(function () {
  const base = window.SAYONA_BASE || '';

  const html = `
    <footer class="footer">
      <div class="container">
        <div class="grid">
          <div>
            <a href="${base}index.html" class="logo">
              <img src="${base}images/sayona-logo.png" alt="Sayona Shipping Services" class="logo-img">
            </a>
            <p>Global logistics partner providing export and import services including ocean freight, air freight, customs clearance, and warehousing for all types of cargo.</p>
          </div>
          <div>
            <h3>Services</h3>
            <ul>
              <li><a href="${base}services.html#lcl">LCL Shipping</a></li>
              <li><a href="${base}services.html#fcl">FCL Shipping</a></li>
              <li><a href="${base}services.html#air-freight">Air Freight</a></li>
              <li><a href="${base}services.html#customs">Customs Clearance</a></li>
              <li><a href="${base}services.html#warehousing">Warehousing</a></li>
            </ul>
          </div>
          <div>
            <h3>Industries</h3>
            <ul>
              <li><a href="${base}industries/textile.html">Textile &amp; Apparel</a></li>
              <li><a href="${base}industries/automotive.html">Automotive</a></li>
              <li><a href="${base}industries/hightech.html">High-Tech</a></li>
              <li><a href="${base}industries/pharma.html">Pharmaceuticals</a></li>
              <li><a href="${base}industries/agri-products.html">Agri Products</a></li>
              <li><a href="${base}industries/general-cargo.html">General Cargo</a></li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><a href="${base}company.html">About Us</a></li>
              <li><a href="${base}index.html#process">Our Process</a></li>
              <li><a href="${base}careers.html">Careers</a></li>
              <li><a href="${base}privacy-policy.html">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <p>15, 60 Feet Rd, Kumarananthapuram,<br>Tirupur, Tamil Nadu, India - 641602</p>
            <p><a href="mailto:sayonaexim@gmail.com">sayonaexim@gmail.com</a></p>
            <p><a href="tel:+919790057690" class="highlight">9790057690</a></p>
            <div class="social-links mt-1">
              <a href="https://facebook.com/sayonashipping" target="_blank" aria-label="Facebook" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a>
              <a href="https://twitter.com/sayonashipping" target="_blank" aria-label="Twitter" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>
              <a href="https://linkedin.com/company/sayonashipping" target="_blank" aria-label="LinkedIn" rel="noopener noreferrer"><i class="fab fa-linkedin-in"></i></a>
              <a href="https://instagram.com/sayonashipping" target="_blank" aria-label="Instagram" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div class="copyright text-center mt-3 pt-3 border-top">
          <p>&copy; <span id="year">${new Date().getFullYear()}</span> Sayona Shipping Service. All rights reserved.</p>
        </div>
      </div>
    </footer>`;

  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
    placeholder.innerHTML = html;
  }
})();
