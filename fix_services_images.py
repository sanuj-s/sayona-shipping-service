import re

with open("services.html", "r") as f:
    html = f.read()

# Replace Service images
html = html.replace('src="/src/assets/images/lcl_shipping.png"', 'src="/src/assets/images/services/sea.jpg"')
html = html.replace('src="/src/assets/images/fcl_shipping.png"', 'src="/src/assets/images/services/sea.jpg"')
# Wait, let's just do a regex replace to be safe since Air freight / Customs had different names
html = re.sub(r'<img src="/src/assets/images/lcl_shipping.*?\.png".*?>', '<img src="/src/assets/images/services/sea.jpg" alt="LCL Shipping">', html)
html = re.sub(r'<img src="/src/assets/images/fcl_shipping.*?\.png".*?>', '<img src="/src/assets/images/services/sea.jpg" alt="FCL Shipping">', html)
html = re.sub(r'<img src="/src/assets/images/air_freight.*?\.png".*?>', '<img src="/src/assets/images/services/air.jpg" alt="Air Freight Export">', html)
html = re.sub(r'<img src="/src/assets/images/customs_clearance.*?\.png".*?>', '<img src="/src/assets/images/services/road.jpg" alt="Customs Clearance">', html)
html = re.sub(r'<img src="/src/assets/images/warehousing.*?\.png".*?>', '<img src="/src/assets/images/about/warehouse.jpg" alt="Warehousing and Storage">', html)

# Apply page-header to the top banner
html = html.replace('<section class="page-header section-alt text-center">', '<section class="page-header text-center">')

with open("services.html", "w") as f:
    f.write(html)

with open("contact.html", "r") as f:
    chtml = f.read()

# For Contact page, wrap the form container in a grid and place the office image next to it
grid_layout = """            <section id="contact-form" class="section-alt" style="padding: 100px 0;">
                <div class="container">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start;">
                        <div class="contact-info-image">
                            <img src="/src/assets/images/contact/office.jpg" alt="Corporate Logistics Office" style="width: 100%; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); margin-bottom: 30px;">
                            <h3 class="color-text-main mb-1">Sayona Logistics Center</h3>
                            <p class="color-text-secondary lh-lg">Visit our headquarters to discuss your complex supply chain needs with our seasoned experts.</p>
                        </div>
                        <div class="contact-form-container" style="max-width: 100%;">
                            <form id="contactForm" class="card">"""

chtml = chtml.replace('            <section id="contact-form" class="section-alt" style="padding-top: 0;">\n                <div class="container contact-form-container">\n                    <form id="contactForm" class="card">', grid_layout)

# Close the new grid div
chtml = chtml.replace('                    </form>\n                </div>\n            </section>', '                    </form>\n                        </div>\n                    </div>\n                </div>\n            </section>')

# Use the established page-header style
chtml = chtml.replace('<section class="contact-hero section-alt">', '<section class="page-header text-center">')

with open("contact.html", "w") as f:
    f.write(chtml)
