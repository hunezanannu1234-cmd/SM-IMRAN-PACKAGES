# Mockup renderer (optional, development only)
Generates the illustrative studio carton images in `public/images/mockups/` using three.js in headless Chromium.
Not needed to run the website. To regenerate: `npm i three@0.170.0` in this folder, install Playwright + Pillow,
edit `mkjobs.py`, run `python3 mkjobs.py && python3 render.py jobs.json ../../public/images/mockups`.
Replace these renders with real company photographs when available.
