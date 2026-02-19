# Update services.html to use the new service-block structure
import re

with open("services.html", 'r') as f:
    html = f.read()

# Replace the whole <section id="services-list" class="section-alt"> block
new_section = """            <section class="services-section">
                <div class="container">
                    
                    <!-- Service 1: LCL -->
                    <div class="service-block">
                        <div class="service-text">
                            <h2>LCL Shipments</h2>
                            <p>Cost-efficient shipping for smaller cargo volumes (Less than Container Load).
                               Consolidation with other shipments reduces cost while maintaining reliable delivery schedules.</p>
                            <ul>
                                <li>Cost sharing with other shippers</li>
                                <li>Regular sailing schedules</li>
                                <li>Flexible cargo volume</li>
                                <li>Door-to-door or port-to-port</li>
                            </ul>
                            <a href="contact.html" class="btn-primary">Request Quote</a>
                        </div>
                        <div class="service-image">
                            <img src="/src/assets/images/lcl_shipping.png" alt="LCL Shipping" loading="lazy">
                        </div>
                    </div>

                    <!-- Service 2: FCL -->
                    <div class="service-block">
                        <div class="service-text">
                            <h2>FCL Shipments</h2>
                            <p>Dedicated container shipping for large cargo (Full Container Load). Maximum security,
                               faster transit, and reduced handling risk.</p>
                            <ul>
                                <li>Exclusive container use (20ft & 40ft)</li>
                                <li>Direct transit without intermediate handling</li>
                                <li>Sealed at origin, opened at destination</li>
                                <li>Ideal for bulk goods and high volume</li>
                            </ul>
                            <a href="contact.html" class="btn-primary">Request Quote</a>
                        </div>
                        <div class="service-image">
                            <img src="/src/assets/images/fcl_shipping.png" alt="FCL Shipping" loading="lazy">
                        </div>
                    </div>

                    <!-- Service 3: Air Freight -->
                    <div class="service-block">
                        <div class="service-text">
                            <h2>Air Freight Export</h2>
                            <p>Fast international delivery for urgent, high-value, or time-sensitive shipments.
                               Global airline network coverage ensures rapid transit.</p>
                            <ul>
                                <li>Express delivery options (24-72 hours)</li>
                                <li>Door-to-door courier services</li>
                                <li>Real-time flight tracking</li>
                                <li>Secure handling for high-value goods</li>
                            </ul>
                            <a href="contact.html" class="btn-primary">Request Quote</a>
                        </div>
                        <div class="service-image">
                            <img src="/src/assets/images/air_freight.png" alt="Air Freight" loading="lazy">
                        </div>
                    </div>

                    <!-- Service 4: Customs -->
                    <div class="service-block">
                        <div class="service-text">
                            <h2>Customs Clearance</h2>
                            <p>Complete handling of export/import documentation, duty compliance, HS
                               classification, and customs processing to facilitate smooth entry.</p>
                            <ul>
                                <li>Documentation preparation (Invoice, Packing List)</li>
                                <li>Duty & Tax calculation assistance</li>
                                <li>Regulatory compliance checking</li>
                                <li>Faster clearance to avoid demurrage</li>
                            </ul>
                            <a href="contact.html" class="btn-primary">Request Quote</a>
                        </div>
                        <div class="service-image">
                            <img src="/src/assets/images/customs_clearance.png" alt="Customs Clearance" loading="lazy">
                        </div>
                    </div>

                    <!-- Service 5: Warehousing -->
                    <div class="service-block">
                        <div class="service-text">
                            <h2>Warehousing & Storage</h2>
                            <p>Secure cargo storage, inventory management, consolidation, and distribution support
                               before export or after import.</p>
                            <ul>
                                <li>Short & long-term storage options</li>
                                <li>Cargo consolidation for LCL</li>
                                <li>Inventory management systems</li>
                                <li>Distribution and last-mile delivery</li>
                            </ul>
                            <a href="contact.html" class="btn-primary">Request Quote</a>
                        </div>
                        <div class="service-image">
                            <img src="/src/assets/images/warehousing.png" alt="Warehousing" loading="lazy">
                        </div>
                    </div>

                </div>
            </section>"""

# Find the section and replace it
import re
new_html = re.sub(r'<section id="services-list" class="section-alt">.*?</section>', new_section, html, flags=re.DOTALL)

with open("services.html", 'w') as f:
    f.write(new_html)
