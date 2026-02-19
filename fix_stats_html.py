import re

html_files = ["index.html", "company.html"]

# The new stats HTML block
new_stats_html_company = """      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <h2 class="counter">30+</h2>
              <p>Years of Industry Experience</p>
            </div>
            <div class="stat-card">
              <h2 class="counter">500+</h2>
              <p>Shipments Delivered</p>
            </div>
            <div class="stat-card">
              <h2 class="counter">120+</h2>
              <p>Global Clients</p>
            </div>
            <div class="stat-card">
              <h2 class="counter">15+</h2>
              <p>Countries Served</p>
            </div>
          </div>
        </div>
      </section>"""

new_stats_html_index = """      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <h2 class="counter stat-number" data-target="500">500</h2>
              <p>Clients</p>
            </div>
            <div class="stat-card">
              <h2 class="counter stat-number" data-target="10000">10000</h2>
              <p>Shipments</p>
            </div>
            <div class="stat-card">
              <h2 class="counter stat-number" data-target="25">25</h2>
              <p>Countries</p>
            </div>
            <div class="stat-card">
              <h2 class="counter stat-number" data-target="30">30</h2>
              <p>Years Experience</p>
            </div>
          </div>
        </div>
      </section>"""


with open("index.html", "r") as f:
    idx_html = f.read()
    
# Replace <section class="stats"> block
idx_html = re.sub(
    r'<section class="stats">.*?<\/section>', 
    new_stats_html_index, 
    idx_html, 
    flags=re.DOTALL
)

with open("index.html", "w") as f:
    f.write(idx_html)

with open("company.html", "r") as f:
    comp_html = f.read()

# Replace <section class="stats-section"> block (it already got partially updated but we can just forcefully replace it with exactly what was requested for cleanliness)
comp_html = re.sub(
    r'<section class="stats-section">.*?<\/section>', 
    new_stats_html_company, 
    comp_html, 
    flags=re.DOTALL
)

with open("company.html", "w") as f:
    f.write(comp_html)

