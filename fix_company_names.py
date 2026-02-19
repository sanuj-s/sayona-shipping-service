import re

with open("company.html", "r") as f:
    html = f.read()

clean_header_and_about_and_stats = """            <!-- Page Header -->
            <section class="page-header section-alt text-center">
                <div class="container">
                    <h1 class="color-text-main mb-1" style="font-size: 3rem;">About Sayona Shipping Services</h1>
                    <p class="color-text-secondary container-sm text-center"
                        style="font-size: 1.2rem; max-width: 700px; margin: 0 auto;">
                        Trusted logistics partner delivering reliable cargo solutions across India and globally.
                    </p>
                </div>
            </section>

            <!-- About Section -->
            <section class="about-section">
                <div class="container">
                    <div class="about-grid">
                        <div class="about-text">
                            <h2 class="section-title text-left mb-1">About Company</h2>
                            <p class="about-desc">
                                Sayona Shipping Services is a professionally managed transport and logistics company
                                delivering reliable and efficient cargo solutions across India and international
                                markets. Established in 2020
                                and backed by over 30 years of industry experience, the company has built a strong
                                reputation for dependable logistics operations and customer-focused service.
                            </p>
                            <p class="about-desc">
                                We specialize in handling a wide range of cargo including general cargo, industrial
                                materials, garments, textile raw materials, consumer goods, automotive components, and
                                regulated shipments. Our services include domestic transport, freight forwarding, customs clearance, and
                                warehousing support.
                            </p>
                            <p class="about-desc" style="margin-bottom:0;">
                                With operational presence in Chennai, Bangalore, Tiruppur, Coimbatore, and Tuticorin,
                                Sayona Shipping Services supports manufacturers, exporters, and businesses with secure,
                                timely, and efficient supply chain solutions. Our experienced team ensures professional handling, operational
                                transparency, and consistent delivery performance.
                            </p>
                        </div>
                        <div class="about-image">
                            <!-- Using /src/assets/images as Vite requires from root index but will use assets/images for literal match if needed. /src works perfectly in Vite -->
                            <img src="/src/assets/images/logistics.jpg" alt="Sayona Shipping Services">
                        </div>
                    </div>
                </div>
            </section>

            <!-- Stats Drop Section -->
            <section class="stats">
                <div class="container">
                    <div class="grid" style="grid-template-columns: 1fr; text-align: center;">
                        <div class="stat-item" style="padding: 40px; background: var(--secondary); border-radius: 12px; border: 1px solid var(--border);">
                            <h2 class="color-accent mb-1" style="font-size: 3rem;">30+</h2>
                            <p class="color-white" style="font-size: 1.2rem;">Years of Industry Experience</p>
                        </div>
                    </div>
                </div>
            </section>"""

# Using regex to replace everything from <!-- Page Header --> up to <!-- Mission & Vision -->
html = re.sub(
    r'<!-- Page Header -->.*?<!-- Mission & Vision -->',
    clean_header_and_about_and_stats + '\n\n            <!-- Mission & Vision -->',
    html,
    flags=re.DOTALL
)

with open("company.html", "w") as f:
    f.write(html)
