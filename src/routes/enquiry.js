const r = require('express').Router(), fs = require('fs'), path = require('path'), crypto = require('crypto'), multer = require('multer'), rateLimit = require('express-rate-limit');
const svc = require('../services/enquiryService'), db = require('../config/db');
const ok = { 'image/jpeg': 1, 'image/png': 1, 'image/webp': 1, 'application/pdf': 1 };
const upload = multer({
  storage: multer.diskStorage({ destination: path.join(__dirname, '../../storage/uploads'), filename: (q, f, cb) => cb(null, crypto.randomBytes(16).toString('hex') + { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'application/pdf': '.pdf' }[f.mimetype]) }),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, fileFilter: (q, f, cb) => cb(null, !!ok[f.mimetype]),
}).array('attachments', 5);
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
// Files are written by multer before validation runs, so rejected submissions must delete them (no orphaned uploads).
const drop = (req) => (req.files || []).forEach(f => fs.unlink(f.path, () => {}));
const csrf = (req, res, next) => req.body && req.body._csrf === req.session.csrf ? next() : (drop(req), res.status(403).render('404', { title: 'Session expired', desc: '', msg: 'Your session expired. Please go back, refresh the page and try again.' }));

r.get('/quote', (req, res) => res.render('quote', { title: 'Request a Quote | SM IMRAN PACKAGES', desc: 'Share your carton requirements and request a quotation from SM IMRAN PACKAGES.', form: { product_type: req.query.product || '' } }));
r.post('/quote', limiter, (req, res, next) => upload(req, res, (err) => err ? res.status(400).render('quote', { title: 'Request a Quote', desc: '', form: req.body || {}, errors: { attachments: 'Attachments must be JPG, PNG, WEBP or PDF, up to 5 files of 10 MB each.' } }) : next()), csrf, async (req, res, next) => {
  try {
    const { e, d } = svc.validate(req.body);
    if (Object.keys(e).length) { drop(req); return res.status(422).render('quote', { title: 'Request a Quote', desc: '', form: req.body, errors: e }); }
    const reference = await svc.create(d, req.files || []);
    res.render('quote-success', { title: 'Enquiry Received | SM IMRAN PACKAGES', desc: '', reference });
  } catch (x) { drop(req); next(x); }
});
r.post('/contact', limiter, csrf, async (req, res, next) => {
  try {
    const b = req.body, name = String(b.name || '').trim().slice(0, 100), message = String(b.message || '').trim().slice(0, 3000);
    if (!name || !message) return res.status(422).render('contact', { title: 'Contact Us', desc: '', form: b, errors: { message: 'Please enter your name and message.' }, sent: false });
    await db('contact_messages').insert({ name, phone: String(b.phone || '').slice(0, 30), email: String(b.email || '').slice(0, 150), message });
    res.redirect('/contact?sent=1');
  } catch (x) { next(x); }
});
module.exports = r;
