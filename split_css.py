import re

with open("css/style.css", "r") as f:
    css = f.read()

# We will just write four entirely new files based on user specification.

style_css = """
:root {
    /* Background layers */
    --bg-main: #F8FAFC;
    --bg-surface: #FFFFFF;
    --bg-elevated: #F1F5F9;

    /* Brand colors */
    --primary: #007bff;
    --secondary: #0a2540;
    --accent: #00c6ff;
    --primary-hover: #0056b3;
    --success: #16a34a;
    --error: #dc2626;

    /* Text */
    --text-main: #0F172A;
    --text-secondary: #64748B;

    /* Borders */
    --border: #E2E8F0;

    /* Effects */
    --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.05);
    --shadow-medium: 0 10px 40px rgba(0, 0, 0, 0.08);
    --shadow-premium: 0 20px 60px rgba(0, 0, 0, 0.12);

    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 4rem;
    --spacing-xl: 8rem;

    /* Typography */
    --font-main: 'Poppins', sans-serif;
    --font-heading: 'Poppins', sans-serif;

    --radius-sm: 4px;
    --radius-md: 14px;
    
    --background: #ffffff;
}

*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html { scroll-behavior: smooth; }

body {
    background: var(--bg-main);
    color: var(--text-main);
    font-family: var(--font-main);
    line-height: 1.6;
    overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--text-main);
    margin-bottom: 20px;
    line-height: 1.2;
    font-weight: 700;
}
h2 { font-size: 42px; }
p { font-size: 18px; line-height: 1.6; }
a { text-decoration: none; color: inherit; transition: color 0.3s ease; }
ul { list-style: none; }
img { max-width: 100%; height: auto; display: block; }

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

section {
    padding: 100px 0;
}

/* Base Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.mt-1 { margin-top: 1rem; }
.mt-3 { margin-top: 3rem; }
.pt-3 { padding-top: 3rem; }
.mb-1 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 3rem; }
.color-primary { color: var(--primary); }
.border-top { border-top: 1px solid var(--border); }
.highlight { color: var(--accent); }
.transform-none { transform: none !important; }
.img-fluid { max-width: 100%; height: auto; }
.rounded { border-radius: 12px; }
.shadow { box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
"""

components_css = """
/* Grid System */
.grid {
    display: grid;
    gap: 30px;
}
.grid-2 { grid-template-columns: 1fr 1fr; }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.align-center { align-items: center; }

/* Navbar */
header {
    position: fixed;
    top: 0; width: 100%; height: 72px; padding: 0;
    background: transparent; z-index: 1000;
    display: flex; align-items: center; transition: 0.3s;
}
header.scrolled { background: white; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
nav {
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; padding: 0 40px; gap: 2rem;
}
.logo { height: 72px; display: flex; align-items: center; font-weight: 700; font-size: 1.5rem; color: var(--text-main); text-decoration: none; }
.logo-img { height: 48px; width: auto; object-fit: contain; }
.nav-links { display: flex; gap: 32px; align-items: center; margin: 0 auto; }
.nav-links a { color: var(--text-main); font-weight: 500; font-size: 1rem; position: relative; transition: color 0.2s; }
.nav-links a::after {
    content: ""; width: 0; height: 2px; background: var(--primary);
    display: block; position: absolute; bottom: -4px; left: 0; transition: 0.3s;
}
.nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
.nav-links a:hover, .nav-links a.active { color: var(--primary); }
.nav-actions { display: flex; gap: 24px; align-items: center; }
.link-track { font-weight: 600; color: var(--text-main); border-bottom: 2px solid transparent; }
.link-track:hover { color: var(--primary); border-bottom-color: var(--primary); }

/* Buttons */
.btn { display: inline-block; font-weight: 600; text-align: center; cursor: pointer; border: none; transition: all 0.3s ease; text-decoration: none; }
.btn-primary { background: var(--primary); color: white; padding: 12px 30px; border-radius: 6px; }
.btn-primary:hover { background: #0056b3; transform: translateY(-3px); }
.btn-large { font-size: 1.2rem; padding: 15px 40px; border-radius: 50px; }
.btn-outline { padding: 14px 28px; border-radius: 10px; border: 1px solid var(--primary); color: var(--primary); background: transparent; }
.btn-outline:hover { background: rgba(0, 123, 255, 0.05); }

/* Cards & Sections */
.card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; padding: 30px; box-shadow: var(--shadow-soft); transition: 0.3s; }
.card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
.section-alt { background: var(--bg-elevated); }
.section-title { text-align: center; font-size: 2.5rem; margin-bottom: var(--spacing-lg); position: relative; color: var(--text-main); }
.section-title.text-left { text-align: left; }
.section-title::after { content: ''; display: block; width: 60px; height: 4px; background-color: var(--accent); margin: var(--spacing-xs) auto 0; border-radius: 2px; }
.section-title.text-left::after { margin: var(--spacing-xs) 0 0; }
.page-header { padding: 4rem 0; text-align: center; }

/* Hero */
.hero { height: 100vh; background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/src/assets/images/hero_split.png') center/cover no-repeat; display: flex; align-items: center; justify-content: center; }
.hero-content { max-width: 800px; position: relative; z-index: 2; margin: 0 auto; text-align: center !important; padding: 0 20px; }
.hero h1 { font-size: 56px; color: white; margin-bottom: var(--spacing-sm); line-height: 1.2; }
.hero p { font-size: 20px; color: white; margin-bottom: var(--spacing-md); opacity: 0.9; }

/* Stats */
.stats { display: flex; justify-content: space-around; background: var(--bg-surface); padding: 80px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 0; }
.stat-item { text-align: center; }
.stat-number { display: block; font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; }
.stat-label { color: var(--text-secondary); font-weight: 500; }

/* Forms */
.tracking-box { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); position: relative; z-index: 2; margin-top: 20px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: flex-start !important; gap: 10px; max-width: 500px; }
input, .form-control, select.form-control { width: 100%; background: white; border: 1px solid var(--border); border-radius: 10px; padding: 14px; transition: all 0.2s ease; font-size: 1rem; color: var(--text-main); font-family: var(--font-main); }
input:focus, .form-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1); }
textarea.form-control { resize: vertical; min-height: 120px; }
.form-group { margin-bottom: var(--spacing-sm); }
.form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-main); }

/* Footer */
.footer { background: #0a2540; color: white; padding: 60px 10%; }
.footer h3 { color: white; font-size: 1.2rem; margin-bottom: 1.5rem; }
.footer p, .footer a, .footer li { color: #94A3B8; margin-bottom: 0.8rem; font-size: 0.95rem; }
.footer a:hover { color: white; }
.footer .logo-img { height: 50px; margin-bottom: 1rem; }
.social-links { display: flex; gap: 1rem; font-size: 1.5rem; }

/* Steps */
.steps { display: flex; justify-content: space-between; gap: 40px; margin-top: 3rem; }
.step { background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05); transition: transform 0.2s; flex: 1; text-align: left; }
.step:hover { transform: translateY(-5px); }
.step-icon { font-size: 32px; margin-bottom: 15px; }
.step h3 { color: var(--primary); margin-bottom: 10px; font-size: 1.25rem; }
.step p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; }

/* Section Specific */
.about-section { background: white; }
.about-desc { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.8; }
.about-img-wrap { position: relative; }
.clients-section { background: var(--bg-elevated); padding-top: 40px; padding-bottom: 40px; }
.clients-title { color: var(--text-secondary); margin-bottom: 2rem; font-size: 1.2rem; }
.clients-flex { display: flex; justify-content: center; gap: 4rem; flex-wrap: wrap; opacity: 0.6; align-items: center; }
.testimonials-section { background: var(--bg-surface); }
.stars { color: var(--accent); font-size: 1.2rem; margin-bottom: 1rem; }
.testimonial-quote { font-style: italic; color: var(--text-secondary); }
.testimonial-author { margin-top: 1rem; color: var(--text-main); }
.cta-section { background: linear-gradient(135deg, var(--secondary), #000); color: white; text-align: center; }
.cta-section h2 { font-size: 2.5rem; margin-bottom: 1rem; color: white; }
.cta-section p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }

/* Page Specifics (From your previous CSS) */
/* Services */
.services-hero { padding: 4rem 0; text-align: center; background: #f8fafc; }
.services-hero-badge { background: #FFE5E5; color: var(--primary); padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 0.9rem; margin-bottom: 20px; display: inline-block; }
.services-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; color: var(--text-main); }
.services-hero p { font-size: 1.25rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto; line-height: 1.6; }
.stats-section { margin-top: -60px; padding-bottom: 60px; position: relative; z-index: 10; }
.service-row { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.service-title { color: var(--primary); font-size: 2rem; margin-bottom: 1rem; }
.service-desc { margin-bottom: 1rem; color: var(--text-secondary); font-size: 1.1rem; }
.service-list { list-style: disc; padding-left: 1.5rem; color: var(--text-secondary); }
.service-img img { width: 100%; height: 350px; object-fit: cover; border-radius: var(--radius-md); box-shadow: var(--shadow-medium); }
.service-cta-text { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 500; }

.service-section { padding: 100px 0; background: var(--bg-surface); }
.service-alt { background: var(--bg-elevated); }
.service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.service-section:nth-child(even) .service-grid { direction: rtl; }
.service-section:nth-child(even) .service-text { direction: ltr; }
.service-text { position: relative; z-index: 2; }
.service-image-wrapper { position: relative; z-index: 1; }
.service-image { border-radius: 20px; overflow: hidden; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12); transition: transform 0.4s ease; background: white; }
.service-image img { width: 100%; height: auto; display: block; transition: transform 0.5s ease; }

/* Tracking */
.tracking-hero { padding: 4rem 0; text-align: center; }
.tracking-hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.tracking-hero p { color: var(--text-secondary); font-size: 1.2rem; max-width: 600px; margin: 0 auto; }
.tracking-section { padding: 4rem 0; min-height: 60vh; }
.tracking-search-box { margin: 0 auto 3rem auto; width: 100%; display: flex; gap: 10px; }
.tracking-loading { margin-bottom: 20px; }
.tracking-header { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); margin-bottom: 25px; }
.tracking-header h2 { margin: 0; font-size: 24px; }
.status { margin-top: 10px; font-weight: bold; color: var(--success); }
.info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
.info-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
.info-card label { font-size: 13px; color: #666; }
.info-card p { margin: 5px 0 0; font-weight: bold; }
.timeline { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
.timeline h3 { margin-top: 0; }
.timeline-item { display: flex; margin-bottom: 20px; }
.timeline-dot { width: 14px; height: 14px; background: var(--text-secondary); border-radius: 50%; margin-right: 15px; margin-top: 5px; }
.timeline-content { flex: 1; }
.timeline-content strong { display: block; }
.timeline-content span { font-size: 13px; color: #666; }
.timeline-item.completed .timeline-dot { background: var(--success); }
.timeline-item.current .timeline-dot { background: var(--accent); box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.2); }
.tracking-card { border: 1px solid #ddd; padding: 20px; margin-top: 20px; border-radius: 8px; background: #fff; text-align: left; }
.progress { display: flex; justify-content: space-between; margin-top: 20px; }
.step.completed { background: green; color: white; }

/* Contact */
.contact-hero { padding: 4rem 0; text-align: center; }
.contact-hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.contact-hero p { color: var(--text-secondary); font-size: 1.2rem; max-width: 600px; margin: 0 auto; }
.contact-form-container { max-width: 800px; margin: 0 auto; }
.contact-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.contact-section-title { margin: 2rem 0 1rem; font-size: 1.25rem; }
.map-container { border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-medium); margin-top: 4rem; }
#formMessage { margin-top: 1rem; font-weight: 600; text-align: center; }
"""

animations_css = """
/* Hero Animation */
.hero { animation: fadeIn 1s ease-in; }
.hero h1 { animation: fadeUp 1s ease; }

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Loading Spinner */
.spinner {
    border: 4px solid #eee;
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    width: 30px; height: 30px;
    animation: spin 1s linear infinite;
    margin: auto;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Scroll Animations */
.animate {
    opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out;
}
.animate.visible { opacity: 1; transform: translateY(0); }

/* Global Loader */
#loader {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: white; z-index: 9999; display: flex;
    justify-content: center; align-items: center;
}
#loader::after {
    content: ""; width: 50px; height: 50px; border: 5px solid #ccc;
    border-top-color: var(--primary); border-radius: 50%;
    animation: loader-spin 1s linear infinite;
}
@keyframes loader-spin {
    to { transform: rotate(360deg); }
}

/* Image Hovers */
img { transition: transform 0.4s ease; }
img:hover { transform: scale(1.05); }

/* Service Image Hovers */
.service-image:hover { transform: translateY(-5px); }
.service-image:hover img { transform: scale(1.05); }

/* Progress Bar */
.scroll-progress-bar {
    position: fixed; top: 0; left: 0; height: 4px;
    background: var(--primary); width: 0%; z-index: 9999;
}
"""

responsive_css = """
/* Mobile Menu Overlay */
.mobile-menu-btn { display: none; background: none; border: none; font-size: 1.8rem; cursor: pointer; color: var(--text-main); }
.mobile-menu { position: fixed; top: 72px; left: 0; width: 100%; background: white; border-bottom: 1px solid var(--border); box-shadow: var(--shadow-medium); padding: 2rem; display: none; flex-direction: column; gap: 1.5rem; z-index: 999; }
.mobile-menu.active { display: flex; }

#navMenu { display: none; background: white; padding: 1rem; position: absolute; top: 72px; left: 0; right: 0; box-shadow: var(--shadow-medium); z-index: 1000; }
#navMenu.active { display: block; }
#navMenu a { display: block; padding: 10px 0; border-bottom: 1px solid var(--border); }
#navMenu a:last-child { border-bottom: none; }

/* Responsive Media Queries */
@media (max-width: 960px) {
    .nav-links, .nav-actions .btn-text { display: none; }
    .mobile-menu-btn { display: block; }
    nav { padding: 0 20px; }
    .hero { grid-template-columns: 1fr; padding-top: 100px; gap: 2rem; text-align: center; }
    .hero-content { padding-left: 0; }
    .service-grid { grid-template-columns: 1fr; gap: 40px; direction: ltr !important; }
    .service-text { direction: ltr !important; }
    .stats { flex-wrap: wrap; gap: 2rem; }
    .footer-content { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
    .footer-content { grid-template-columns: 1fr; }
    .steps { flex-direction: column; gap: 20px; }
    .info-grid { grid-template-columns: 1fr; }
    .contact-form-grid { grid-template-columns: 1fr; }
    .logo-img { height: 36px; }
}
"""

with open("css/style.css", "w") as f:
    f.write(style_css)

with open("css/components.css", "w") as f:
    f.write(components_css)

with open("css/animations.css", "w") as f:
    f.write(animations_css)

with open("css/responsive.css", "w") as f:
    f.write(responsive_css)

