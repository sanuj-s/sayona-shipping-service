import re

# Update HTML files
def process_html():
    with open('index.html', 'r') as f:
        idx = f.read()

    # Wait, the user said for Services: 
    # <div class="service-card">
    #   <img src="assets/images/services/air.jpg">
    #   <h3>Air Freight</h3>

    # Let's cleanly replace the <article class="card"> blocks in index.html Services section
    # with the requested image structure.
    
    idx = idx.replace('<article class="card">\n              <i class="fas fa-ship fa-2x color-primary mb-1"></i>\n              <h3>LCL Shipments</h3>',
                      '<article class="service-card">\n              <img src="/src/assets/images/services/sea.jpg" alt="LCL Shipping">\n              <h3>LCL Shipments</h3>')
                      
    idx = idx.replace('<article class="card">\n              <i class="fas fa-boxes fa-2x color-primary mb-1"></i>\n              <h3>FCL Shipments</h3>',
                      '<article class="service-card">\n              <img src="/src/assets/images/services/sea.jpg" alt="FCL Shipping">\n              <h3>FCL Shipments</h3>')
                      
    idx = idx.replace('<article class="card">\n              <i class="fas fa-plane-departure fa-2x color-primary mb-1"></i>\n              <h3>Air Freight Export</h3>',
                      '<article class="service-card">\n              <img src="/src/assets/images/services/air.jpg" alt="Air Freight">\n              <h3>Air Freight Export</h3>')
                      
    idx = idx.replace('<article class="card">\n              <i class="fas fa-file-contract fa-2x color-primary mb-1"></i>\n              <h3>Customs Clearance</h3>',
                      '<article class="service-card">\n              <img src="/src/assets/images/services/road.jpg" alt="Customs Clearance">\n              <h3>Customs Clearance</h3>')
                      
    idx = idx.replace('<article class="card">\n              <i class="fas fa-warehouse fa-2x color-primary mb-1"></i>\n              <h3>Warehousing</h3>',
                      '<article class="service-card">\n              <img src="/src/assets/images/about/warehouse.jpg" alt="Warehousing">\n              <h3>Warehousing</h3>')

    # Industries section in index.html - user wants text, automotive, electronics. We generated textile.
    idx = idx.replace('<i class="fas fa-tshirt fa-3x color-primary mb-1"></i>\n        <h3 class="mb-1">Textile Industry</h3>',
                      '<img src="/src/assets/images/industries/textile.jpg" alt="Textile Industry" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">\n        <h3 class="mb-1">Textile Industry</h3>')

    with open('index.html', 'w') as f:
        f.write(idx)

process_html()
