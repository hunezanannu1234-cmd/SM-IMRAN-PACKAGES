# Test report (executed on Linux, Node 22, headless Chromium)
- `npm test`: 36 checks, all passed. Covers all pages and assets, all internal links (25), product and custom-CTA copy, CTA directly after the last product, WhatsApp unset/set links, all page images and both fonts load, no external font requests, CSRF rejection, validation rejection, valid enquiry saved as "New Enquiry", private upload stored and not web-accessible, no orphaned uploads after rejected submissions, activity log.
- `npm audit`: 0 vulnerabilities.
- Responsive browser QA: 9 pages x 7 widths (1920, 1440, 1280, 1024, 768, 390, 360). Checked horizontal overflow, broken images, off-screen text and header wrapping: no issues. Mobile menu opens, navigates, and closes on Esc.
- WhatsApp with a configured test number: custom CTA link is wa.me with target=_blank and the placeholder notice is hidden.
Not tested: real devices/Safari/Firefox, Windows install (previous fix verified via prebuilt-binary availability only), keyboard-only walkthrough, screen reader, formal contrast audit, page-speed measurement.
