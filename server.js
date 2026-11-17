require('dotenv').config();
const path = require('path'), crypto = require('crypto');
const express = require('express'), helmet = require('helmet'), session = require('express-session');
const db = require('./src/config/db'), company = require('./src/config/company'), content = require('./src/config/content');
const app = express();
app.set('view engine', 'ejs'); app.set('views', path.join(__dirname, 'src/views'));
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], imgSrc: ["'self'", 'data:'], styleSrc: ["'self'"], fontSrc: ["'self'"], scriptSrc: ["'self'"], formAction: ["'self'"] } } }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(session({ secret: process.env.SESSION_SECRET || 'dev-only-secret', resave: false, saveUninitialized: false, name: 'smi.sid',
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' } }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));
app.use((req, res, next) => {
  if (!req.session.csrf) req.session.csrf = crypto.randomBytes(24).toString('hex');
  Object.assign(res.locals, { company, content, csrf: req.session.csrf, path: req.path, errors: null, form: {} });
  next();
});
app.use(require('./src/routes/public'));
app.use(require('./src/routes/enquiry'));
app.use((req, res) => res.status(404).render('404', { title: 'Page not found', desc: '' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).render('404', { title: 'Something went wrong', desc: '', msg: 'Something went wrong. Please try again or contact us.' }); });
const port = process.env.PORT || 3000;
db.migrate.latest().then(() => { if (require.main === module) app.listen(port, () => console.log(`SM IMRAN PACKAGES running on http://localhost:${port}`)); });
module.exports = app;
