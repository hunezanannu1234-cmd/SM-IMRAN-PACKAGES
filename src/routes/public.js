const r = require('express').Router();
const pages = {
  '/': ['home', 'Custom Carton Manufacturers in Pakistan | SM IMRAN PACKAGES', 'SM IMRAN PACKAGES develops custom carton packaging to your requirements: corrugated, printed, partition and window cartons. Request a quote.'],
  '/about': ['about', 'About Us | SM IMRAN PACKAGES', 'Learn how SM IMRAN PACKAGES works with businesses to develop custom carton packaging through a physical sample-first process.'],
  '/products': ['products', 'Carton Products and Packaging Boxes | SM IMRAN PACKAGES', 'Corrugated, printed, board, partition and window cartons. Need something different? We also discuss custom packaging.'],
  '/custom-packaging': ['custom', 'Custom Carton Packaging | SM IMRAN PACKAGES', 'Custom dimensions, printing, partitions, windows and reference samples. Discuss your packaging requirements with us.'],
  '/process': ['process', 'Our Process: Sample-First Packaging | SM IMRAN PACKAGES', 'From requirements and quotation to a physical sample, approval and bulk manufacturing.'],
  '/gallery': ['gallery', 'Packaging Gallery | SM IMRAN PACKAGES', 'A gallery of carton and packaging work.'],
  '/contact': ['contact', 'Contact Us | SM IMRAN PACKAGES', 'Contact SM IMRAN PACKAGES to discuss your carton and packaging requirements.'],
  '/privacy': ['legal', 'Privacy Policy | SM IMRAN PACKAGES', 'Privacy Policy draft.'],
  '/terms': ['legal', 'Terms and Conditions | SM IMRAN PACKAGES', 'Terms and Conditions draft.'],
};
for (const [p, [view, title, desc]] of Object.entries(pages))
  r.get(p, (req, res) => res.render(view, { title, desc, legal: p.slice(1), sent: req.query.sent === '1' }));

// Neutral labelled placeholder for photographs the company still has to supply (never presented as real work)
r.get('/placeholder/:label.svg', (req, res) => { const l = req.params.label.replace(/[^\w &\-]/g, '').slice(0, 50);
  res.type('image/svg+xml').set('Cache-Control', 'public, max-age=86400').send(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="${l} - placeholder"><rect width="400" height="300" fill="#E9EBEE"/><rect x="14" y="14" width="372" height="272" fill="none" stroke="#9aa1a9" stroke-dasharray="6 6"/><text x="200" y="146" text-anchor="middle" font-family="Arial" font-size="17" fill="#25282D">${l}</text><text x="200" y="174" text-anchor="middle" font-family="Arial" font-size="11" letter-spacing="2" fill="#173F78">PLACEHOLDER - REPLACE WITH REAL PHOTO</text></svg>`); });
module.exports = r;
