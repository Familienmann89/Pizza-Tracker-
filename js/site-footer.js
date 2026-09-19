document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-site-footer]')) return;

    const footer = document.createElement('footer');
    footer.className = 'site-footer border-top py-4 mt-auto';
    footer.dataset.siteFooter = '';
    footer.innerHTML = `
        <div class="container">
            <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                <div>
                    <strong>Pizza Tracker</strong>
                    <div class="small text-secondary">Hochschulprojekt · Keine echte Bestellplattform</div>
                </div>
                <nav class="footer-links" aria-label="Rechtliche und ergänzende Informationen">
                    <a href="allergene.html">Allergene &amp; Inhaltsstoffe</a>
                    <a href="datenschutz.html">Datenschutz</a>
                    <a href="impressum.html">Impressum</a>
                </nav>
            </div>
            <div class="small text-secondary mt-3">© 2026 Projektgruppe Pizza Tracker · Wirtschaftsinformatik-Projekt I (Softwaretechnik), WK_1106</div>
        </div>`;
    document.body.appendChild(footer);
});
