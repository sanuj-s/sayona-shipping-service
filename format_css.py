# Let's write Python to completely reconstruct the CSS files exactly per user request.

style_css = """/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Root color system */
:root {
  --primary: #007bff;
  --secondary: #0a2540;
  --accent: #00c6ff;
  --text: #333;
  --background: #ffffff;
  
  /* Additional variables needed for the site */
  --bg-main: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-elevated: #F1F5F9;
  --border: #E2E8F0;
  --text-main: #0F172A;
  --text-secondary: #64748B;
  --success: #16a34a;
}

/* Typography */
body {
  font-family: 'Poppins', sans-serif;
  color: var(--text);
  background: var(--background);
}

h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; color: var(--text-main); margin-bottom: 20px; line-height: 1.2; font-weight: 700; }
p { font-size: 18px; line-height: 1.6; }
a { text-decoration: none; color: inherit; transition: color 0.3s ease; }
ul { list-style: none; }

/* Layout containers */
.container {
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
}

/* Section spacing */
section {
  padding: 100px 0;
}

/* Base utilities needed for pages */
.text-center { text-align: center; }
.text-left { text-align: left; }
.mt-1 { margin-top: 1rem; }
.mb-1 { margin-bottom: 1rem; }
.color-primary { color: var(--primary); }

/* Image system */
img {
  max-width: 100%;
  display: block;
  height: auto;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
"""

components_css = """/* Navbar */
.navbar {
  position: fixed;
  width: 100%;
  padding: 20px 40px;
  z-index: 1000;
  transition: 0.3s;
}

.navbar.scrolled {
  background: white;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

header {
  position: fixed; top: 0; width: 100%; height: 72px; padding: 0;
  background: transparent; z-index: 1000; display: flex; align-items: center; transition: 0.3s;
}
header.scrolled { background: white; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
nav { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 40px; gap: 2rem; }
.logo { height: 72px; display: flex; align-items: center; font-weight: 700; font-size: 1.5rem; color: var(--text-main); text-decoration: none; }
.logo-img { height: 48px; width: auto; object-fit: contain; }

/* Navigation links */
.nav-link {
  text-decoration: none;
  color: var(--text);
  position: relative;
}

.nav-link::after {
  content: "";
  height: 2px;
  width: 0;
  background: var(--primary);
  position: absolute;
  bottom: -5px;
  left: 0;
  transition: 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-links { display: flex; gap: 32px; align-items: center; margin: 0 auto; }
.nav-links a { color: var(--text-main); font-weight: 500; font-size: 1rem; position: relative; transition: color 0.2s; }
.nav-links a::after { content: ""; width: 0; height: 2px; background: var(--primary); display: block; position: absolute; bottom: -4px; left: 0; transition: 0.3s; }
.nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
.nav-links a:hover, .nav-links a.active { color: var(--primary); }
.nav-actions { display: flex; gap: 24px; align-items: center; }
.link-track { font-weight: 600; color: var(--text-main); border-bottom: 2px solid transparent; }
.link-track:hover { color: var(--primary); border-bottom-color: var(--primary); }

/* Buttons */
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 12px 30px;
  border-radius: 6px;
  text-decoration: none;
  transition: 0.3s;
  display: inline-block;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-3px);
  background: #0056b3;
}

.btn { display: inline-block; font-weight: 600; text-align: center; cursor: pointer; border: none; transition: all 0.3s ease; text-decoration: none; }
.btn-outline { padding: 14px 28px; border-radius: 10px; border: 1px solid var(--primary); color: var(--primary); background: transparent; }
.btn-outline:hover { background: rgba(0, 123, 255, 0.05); }
.btn-large { font-size: 1.2rem; padding: 15px 40px; border-radius: 50px; }

/* Cards */
.card {
  padding: 30px;
  border-radius: 12px;
  background: white;
  transition: 0.3s;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

/* Grid system */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
  gap: 30px;
}
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.align-center { align-items: center; }

/* Footer */
.footer {
  background: var(--secondary);
  color: white;
  padding: 60px 0;
}
.footer h3 { color: white; font-size: 1.2rem; margin-bottom: 1.5rem; }
.footer p, .footer a, .footer li { color: #94A3B8; margin-bottom: 0.8rem; font-size: 0.95rem; }
.footer a:hover { color: white; }
.footer .logo-img { height: 50px; margin-bottom: 1rem; }
.social-links { display: flex; gap: 1rem; font-size: 1.5rem; }

/* Page Specific UI Components */
.section-alt { background: var(--bg-elevated); }
.section-title { text-align: center; font-size: 2.5rem; margin-bottom: 2rem; position: relative; color: var(--text-main); }
.section-title.text-left { text-align: left; }
.section-title::after { content: ''; display: block; width: 60px; height: 4px; background-color: var(--accent); margin: 0.5rem auto 0; border-radius: 2px; }
.section-title.text-left::after { margin: 0.5rem 0 0; }

.hero { height: 100vh; background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/src/assets/images/hero_split.png') center/cover no-repeat; display: flex; align-items: center; justify-content: center; }
.hero-content { max-width: 800px; position: relative; z-index: 2; margin: 0 auto; text-align: center !important; padding: 0 20px; }
.hero h1 { font-size: 56px; color: white; margin-bottom: 1rem; line-height: 1.2; }
.hero p { font-size: 20px; color: white; margin-bottom: 2rem; opacity: 0.9; }

.stats { display: flex; justify-content: space-around; background: var(--bg-surface); padding: 80px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 0; }
.stat-item { text-align: center; }
.stat-number { display: block; font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; }
.stat-label { color: var(--text-secondary); font-weight: 500; }

/* Forms & UI */
.tracking-box { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); position: relative; z-index: 2; margin-top: 20px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: flex-start !important; gap: 10px; max-width: 500px; }
input, .form-control, select.form-control { width: 100%; background: white; border: 1px solid var(--border); border-radius: 10px; padding: 14px; transition: all 0.2s ease; font-size: 1rem; color: var(--text-main); font-family: 'Poppins', sans-serif; }
input:focus, .form-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1); }
textarea.form-control { resize: vertical; min-height: 120px; }
.form-group { margin-bottom: 1rem; }

.steps { display: flex; justify-content: space-between; gap: 40px; margin-top: 3rem; }
.step { background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05); transition: transform 0.2s; flex: 1; text-align: left; }
.step-icon { font-size: 32px; margin-bottom: 15px; }
.step h3 { color: var(--primary); margin-bottom: 10px; font-size: 1.25rem; }
.step p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; }

.cta-section { background: linear-gradient(135deg, var(--secondary), #000); color: white; text-align: center; }
.cta-section h2 { font-size: 2.5rem; margin-bottom: 1rem; color: white; }
.cta-section p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
"""

animations_css = """/* Loader */
#loader {
  position: fixed;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #eee;
  border-top: 5px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

/* Fade animation */
.fade-up {
  animation: fadeUp 1s ease;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Image hover */
img {
  transition: 0.4s;
}

img:hover {
  transform: scale(1.05);
}

/* Scroll Animations */
.animate { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
.animate.visible { opacity: 1; transform: translateY(0); }
.hero { animation: fadeIn 1s ease-in; }
.hero h1 { animation: fadeUp 1s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.service-image:hover { transform: translateY(-5px); }
.service-image:hover img { transform: scale(1.05); }

/* Progress bar specific animation/ui */
#progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: var(--primary);
  width: 0;
  z-index: 9999;
  transition: width 0.2s ease-out;
}
"""

responsive_css = """@media (max-width: 960px) {
    .nav-links, .nav-actions .btn-text { display: none; }
    .mobile-menu-btn { display: block; }
    nav { padding: 0 20px; }
    .hero { grid-template-columns: 1fr; padding-top: 100px; gap: 2rem; text-align: center; }
    .hero-content { padding-left: 0; }
    .stats { flex-wrap: wrap; gap: 2rem; }
    .footer-content { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .navbar {
    padding: 15px 20px;
  }

  section {
    padding: 60px 0;
  }

  .grid {
    grid-template-columns: 1fr;
  }

    .footer-content { grid-template-columns: 1fr; }
    .steps { flex-direction: column; gap: 20px; }
    .info-grid { grid-template-columns: 1fr; }
    .contact-form-grid { grid-template-columns: 1fr; }
    .logo-img { height: 36px; }
}

.mobile-menu-btn { display: none; background: none; border: none; font-size: 1.8rem; cursor: pointer; color: var(--text-main); }
.mobile-menu { position: fixed; top: 72px; left: 0; width: 100%; background: white; border-bottom: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); padding: 2rem; display: none; flex-direction: column; gap: 1.5rem; z-index: 999; }
.mobile-menu.active { display: flex; }
#navMenu { display: none; background: white; padding: 1rem; position: absolute; top: 72px; left: 0; right: 0; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); z-index: 1000; }
#navMenu.active { display: block; }
#navMenu a { display: block; padding: 10px 0; border-bottom: 1px solid #E2E8F0; }
#navMenu a:last-child { border-bottom: none; }
"""

with open("css/style.css", "w") as f:
    f.write(style_css)
with open("css/components.css", "w") as f:
    f.write(components_css)
with open("css/animations.css", "w") as f:
    f.write(animations_css)
with open("css/responsive.css", "w") as f:
    f.write(responsive_css)
