import re

# Update index.html
with open("index.html", "r") as f:
    html = f.read()

# Replace sea.jpg under LCL Shipments
html = re.sub(r'<img src="/src/assets/images/services/sea.jpg" alt="LCL Shipping">', '<img src="/src/assets/images/services/lcl-consolidation.jpg" alt="LCL consolidation">', html)

# Replace sea.jpg under FCL Shipments
html = re.sub(r'<img src="/src/assets/images/services/sea.jpg" alt="FCL Shipping">', '<img src="/src/assets/images/services/fcl-container-ship.jpg" alt="FCL container shipping">', html)

# Replace road.jpg under Customs Clearance
html = re.sub(r'<img src="/src/assets/images/services/road.jpg" alt="Customs Clearance">', '<img src="/src/assets/images/services/customs-clearance.jpg" alt="Customs clearance inspection">', html)

with open("index.html", "w") as f:
    f.write(html)

# Update services.html
with open("services.html", "r") as f:
    shtml = f.read()

shtml = re.sub(r'<img src="/src/assets/images/services/sea.jpg".*?>', '<img src="/src/assets/images/services/lcl-consolidation.jpg" alt="LCL consolidation" loading="lazy">', shtml, count=1)
shtml = re.sub(r'<img src="/src/assets/images/services/sea.jpg".*?>', '<img src="/src/assets/images/services/fcl-container-ship.jpg" alt="FCL container shipping" loading="lazy">', shtml, count=1)
shtml = re.sub(r'<img src="/src/assets/images/services/road.jpg".*?>', '<img src="/src/assets/images/services/customs-clearance.jpg" alt="Customs clearance inspection" loading="lazy">', shtml, count=1)

with open("services.html", "w") as f:
    f.write(shtml)
