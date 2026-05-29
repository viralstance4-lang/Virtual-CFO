/* ===========================
   SHARED COMPONENTS — Navbar & Footer
   Edit here to update across all pages.
=========================== */

const NAVBAR_HTML = `
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a href="index.html" class="nav-logo">
      <img src="VCFO-Logo-PNG.png" alt="Virtual CFO" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"/>
      <div class="nav-logo-text" style="display:none">
        <span>VIRTUAL CFO</span>
        <span>Management Consultancy</span>
      </div>
    </a>
    <ul class="nav-menu">
      <li class="nav-menu-close">
        <button id="navClose" aria-label="Close menu" style="
          background:none;border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:flex-end;width:100%;
          padding:0 0 16px 0;
        ">
          <i class="fa-solid fa-xmark" style="font-size:1.5rem;color:var(--dark)"></i>
        </button>
      </li>
      <li><a href="index.html" class="nav-link">Home</a></li>
      <li><a href="about.html" class="nav-link">About Us</a></li>
      <li class="nav-dropdown">
        <a href="services.html" class="nav-link">Services <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;margin-left:4px"></i></a>
        <div class="nav-dropdown-menu">
          <a href="services.html#virtual-cfo"><i class="fa-solid fa-chart-line" style="color:var(--blue);margin-right:8px"></i>Virtual CFO Services</a>
          <a href="services.html#month-end"><i class="fa-solid fa-calendar-check" style="color:var(--blue);margin-right:8px"></i>Month-end Closing &amp; MIS</a>
          <a href="services.html#audit-tax"><i class="fa-solid fa-shield-halved" style="color:var(--blue);margin-right:8px"></i>Audit &amp; Tax Compliance</a>
          <a href="power-bi.html"><i class="fa-solid fa-chart-bar" style="color:var(--blue);margin-right:8px"></i>Power BI Solutions</a>
          <a href="services.html#process"><i class="fa-solid fa-gears" style="color:var(--blue);margin-right:8px"></i>Process Optimization</a>
        </div>
      </li>
      <li><a href="power-bi.html" class="nav-link">Power BI</a></li>
      <li><a href="virtual-cfo.html" class="nav-link">Virtual CFO</a></li>
      <li><a href="insights.html" class="nav-link">Insights</a></li>
      <li><a href="success-stories.html" class="nav-link">Success Stories</a></li>
      <li><a href="contact.html" class="nav-link">Contact</a></li>
      <li><a href="contact.html#consultation" class="btn btn-primary nav-cta">Free Consultation</a></li>
    </ul>
    <button type="button" class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav-overlay" id="navOverlay"></div>
`;

const FOOTER_HTML = `
<footer class="footer" style="background:linear-gradient(145deg,#0c1835 0%,#111827 60%,#0c1835 100%);border-top:1px solid rgba(255,255,255,0.06);">
  <!-- Footer Top: Stats strip -->
  
  <div class="container" style="padding-top:56px;padding-bottom:0;">
    <div class="footer-grid">
      <!-- Brand -->
      <div class="footer-brand">
        <img src="VCFO-Logo-PNG-white.png" alt="Virtual CFO" style="height:46px;margin-bottom:18px;" onerror="this.style.display='none'"/>
        <p style="font-size:0.88rem;line-height:1.75;color:rgba(255,255,255,0.55);margin-bottom:24px;">Virtual CFO Management Consultancy delivers CFO-level financial expertise, Power BI analytics, and strategic advisory — transforming how businesses manage, understand, and grow their finances.</p>
        <div class="footer-social" style="display:flex;gap:10px;">
          <a href="#" class="social-icon" title="LinkedIn" style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:0.95rem;color:rgba(255,255,255,0.7);border-radius:10px;"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="https://wa.me/971565075253" class="social-icon" title="WhatsApp" style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:0.95rem;color:rgba(255,255,255,0.7);border-radius:10px;"><i class="fa-brands fa-whatsapp"></i></a>
          <a href="mailto:info@virtualcfo.ae" class="social-icon" title="Email" style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:0.95rem;color:rgba(255,255,255,0.7);border-radius:10px;"><i class="fa-solid fa-envelope"></i></a>
        </div>
      </div>

      <!-- Services -->
      <div class="footer-col">
        <h5 style="font-size:0.8rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:18px;">Services</h5>
        <div class="footer-links" style="display:flex;flex-direction:column;gap:10px;">
          <a href="virtual-cfo.html" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>Virtual CFO Services</a>
          <a href="services.html#month-end" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>Month-end &amp; MIS</a>
          <a href="services.html#audit-tax" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>Audit &amp; Tax Compliance</a>
          <a href="power-bi.html" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>Power BI Solutions</a>
          <a href="services.html#process" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>Process Optimization</a>
        </div>
      </div>

      <!-- Company -->
      <div class="footer-col">
        <h5 style="font-size:0.8rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:18px;">Company</h5>
        <div class="footer-links" style="display:flex;flex-direction:column;gap:10px;">
          <a href="about.html" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>About Us</a>
          <a href="insights.html" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>Insights &amp; Resources</a>
          <a href="success-stories.html" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>Success Stories</a>
          <a href="contact.html" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>Contact Us</a>
          <a href="contact.html#consultation" class="footer-link" style="font-size:0.88rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.3s,padding-left 0.3s;"><i class="fa-solid fa-chevron-right" style="font-size:0.6rem;color:#F5C518;"></i>Free Consultation</a>
        </div>
      </div>

      <!-- Contact -->
      <div class="footer-col">
        <h5 style="font-size:0.8rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:18px;">Get In Touch</h5>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:18px;">
          <a href="tel:+97148858622" style="font-size:0.86rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color 0.3s;"><span style="width:30px;height:30px;background:rgba(245,197,24,0.12);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-phone" style="color:#F5C518;font-size:0.75rem;"></i></span>+971 4 885 8622</a>
          <a href="tel:+971565075253" style="font-size:0.86rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color 0.3s;"><span style="width:30px;height:30px;background:rgba(245,197,24,0.12);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-mobile" style="color:#F5C518;font-size:0.75rem;"></i></span>+971 56 507 5253</a>
          <a href="mailto:info@virtualcfo.ae" style="font-size:0.86rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color 0.3s;"><span style="width:30px;height:30px;background:rgba(245,197,24,0.12);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid fa-envelope" style="color:#F5C518;font-size:0.75rem;"></i></span>info@virtualcfo.ae</a>
          <a href="https://wa.me/971565075253" style="font-size:0.86rem;color:rgba(255,255,255,0.65);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color 0.3s;"><span style="width:30px;height:30px;background:rgba(37,211,102,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-brands fa-whatsapp" style="color:#25d366;font-size:0.8rem;"></i></span>Chat on WhatsApp</a>
        </div>
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px 14px;">
          <div style="font-size:0.72rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Office Address</div>
          <p style="font-size:0.8rem;color:rgba(255,255,255,0.45);line-height:1.6;margin:0;">102, 1st Floor, Sheikha Mahra Building, Near Al Tawar Centre, Al Qusais 2, Dubai, UAE</p>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom" style="margin-top:40px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px;">
      <span style="font-size:0.82rem;color:rgba(255,255,255,0.35);">&copy; 2025 Virtual CFO Management Consultancy. All rights reserved. &nbsp;·&nbsp; Developed by <a href="https://virallstance.com/" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#F5C518'" onmouseout="this.style.color='rgba(255,255,255,0.5)'">Virall Stance</a></span>
    </div>
  </div>
</footer>
<a href="https://wa.me/971565075253" class="whatsapp-float" title="Chat on WhatsApp" target="_blank">
  <i class="fa-brands fa-whatsapp"></i>
</a>
`;

(function () {
  const navEl = document.getElementById('site-nav');
  const footerEl = document.getElementById('site-footer');
  if (navEl) navEl.innerHTML = NAVBAR_HTML;
  if (footerEl) footerEl.innerHTML = FOOTER_HTML;
})();
