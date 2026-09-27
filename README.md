# josedavidgt.com

Personal portfolio and business platform built with Flask, deployed on Vercel.

**Live:** [josedavidgt.com](https://www.josedavidgt.com)

## What's Inside

| Section | Route | Description |
|---|---|---|
| Portfolio | `/` | Projects, articles, and professional profile |
| Brisa Sites | `/brisa-sites/` | Web design service for small Hispanic businesses (USA + Colombia) |
| Excel Course | `/curso` | Online Excel course with Supabase auth and Stripe payments |
| Articles | `/articles/*` | Tech articles about AI, data, and the job market |
| Case Studies | `/blogpost` | Editorial write-ups of personal projects (problem, approach, result) |

## Brisa Sites

Hybrid pricing model — clients pay a one-time setup fee + low monthly maintenance.

| Plan | USA | Colombia |
|---|---|---|
| **Sitio** | $499 setup + $49/mo | $900K setup + $120K/mo |
| **Sweet Spot** | $999 setup + $99/mo | $1.7M setup + $180K/mo |

6 vertical landing pages: restaurantes, barberias, botanicas, tabaquerias, tiendas, galerias.

## Tech Stack

- **Backend:** Python / Flask
- **Frontend:** HTML, CSS, vanilla JS (portfolio) · Next.js 15 (client sites via [site-builder](https://github.com/DeiviGT1))
- **Auth:** Supabase (curso) · session-based (admin)
- **Payments:** Stripe (curso) · Wompi (Colombia clients)
- **Hosting:** Vercel
- **Analytics:** GA4
- **SEO:** robots.txt, sitemap.xml, JSON-LD schema, Open Graph

## Local Development

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
# → http://localhost:5005
```

## Author

**Jose David GT** — Data Engineer, Hollywood FL · josedago1163@gmail.com

[LinkedIn](https://www.linkedin.com/in/davidgt1/) · [GitHub](https://github.com/DeiviGT1) · [Instagram](https://www.instagram.com/davidgt1163/)
