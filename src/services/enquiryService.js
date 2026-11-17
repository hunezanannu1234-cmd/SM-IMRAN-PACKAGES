const crypto = require('crypto'), db = require('../config/db');
const s = (v, max = 500) => String(v || '').trim().slice(0, max);
const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 && n < 100000 ? n : null; };
exports.validate = (b) => {
  const e = {}, d = {
    company_name: s(b.company_name, 150), contact_person: s(b.contact_person, 100), phone: s(b.phone, 30), whatsapp: s(b.whatsapp, 30),
    email: s(b.email, 150), city: s(b.city, 80), address: s(b.address, 300), product_type: s(b.product_type, 80),
    length: num(b.length), width: num(b.width), height: num(b.height), unit: ['mm', 'cm', 'inch'].includes(b.unit) ? b.unit : 'inch',
    material_ply: s(b.material_ply, 80), printing: s(b.printing, 500), print_colours: s(b.print_colours, 40), custom_requirements: s(b.custom_requirements, 500),
    quantity: s(b.quantity, 60), timeline: s(b.timeline, 80), description: s(b.description, 3000), contact_method: ['Phone', 'WhatsApp', 'Email'].includes(b.contact_method) ? b.contact_method : 'WhatsApp',
  };
  if (!d.company_name) e.company_name = 'Please enter your company name.';
  if (!d.contact_person) e.contact_person = 'Please enter a contact person.';
  if (!/^[\d\s+\-()]{7,30}$/.test(d.phone)) e.phone = 'Please enter a valid phone number.';
  if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) e.email = 'Please enter a valid email address.';
  if (!d.city) e.city = 'Please enter your city.';
  if (!d.product_type) e.product_type = 'Please choose a product type.';
  if (!d.description && !(d.length && d.width && d.height)) e.description = 'Please describe your requirements or enter the dimensions.';
  return { e, d };
};
exports.create = (d, files) => db.transaction(async (trx) => {
  const { company_name, contact_person, phone, whatsapp, email, city, address, ...enq } = d;
  const [cid] = await trx('customers').insert({ company_name, contact_person, phone, whatsapp, email, city, address });
  const reference = `SMI-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const [eid] = await trx('enquiries').insert({ reference, customer_id: cid, status: 'New Enquiry', ...enq });
  for (const f of files) await trx('enquiry_files').insert({ enquiry_id: eid, stored_name: f.filename, original_name: f.originalname.slice(0, 200), mime: f.mimetype, size: f.size });
  await trx('activity_log').insert({ entity: 'enquiry', entity_id: eid, action: 'created', detail: `New enquiry ${reference} submitted via website` });
  return reference;
});
