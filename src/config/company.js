// All company details live here. Blank env values render as clearly labelled placeholders.
const ph = (v, label) => v || `[${label} - PLACEHOLDER]`;
const wa = (process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '');
module.exports = {
  name: 'SM IMRAN PACKAGES',
  tagline: 'Strong Carton, Trusted Quality',
  phone: ph(process.env.COMPANY_PHONE, 'Phone number'),
  email: ph(process.env.COMPANY_EMAIL, 'Email address'),
  address: ph(process.env.COMPANY_ADDRESS, 'Business address'),
  hasWhatsApp: !!wa,
  // Until a real number is set, WhatsApp buttons go to the Contact page (no dead links).
  whatsappLink: wa ? `https://wa.me/${wa}?text=${encodeURIComponent('Hello SM IMRAN PACKAGES, I would like to discuss my packaging requirements.')}` : '/contact#whatsapp',
};
