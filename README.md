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
| Project Explain | `/blogpost` | Technical breakdowns of personal projects |

## Brisa Sites

Hybrid pricing model — clients pay a one-time setup fee + low monthly maintenance.

| Plan | USA | Colombia |
|---|---|---|
| **Sitio** | $149 setup + $29/mo | $299K setup + $59K/mo |
| **Sweet Spot** | $299 setup + $59/mo | $599K setup + $99K/mo |

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

**Jose David GT** — Data Engineer, Hollywood FL

[LinkedIn](https://www.linkedin.com/in/davidgt1/) · [GitHub](https://github.com/DeiviGT1) · [Instagram](https://www.instagram.com/davidgt1163/)
