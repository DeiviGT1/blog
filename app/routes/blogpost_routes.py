from flask import Blueprint, render_template, abort

blogpost_bp = Blueprint('blogpost', __name__)

# Metadatos de cada caso de estudio. El orden define el orden en la portada.
# `image` es relativa a /static/. `demo` es un enlace externo opcional.
CASE_STUDIES = [
    {
        "slug": "football-dashboard",
        "title": "Football ELO Dashboard",
        "subtitle": "Interactive club-rating charts rendered by a Cloud Run microservice, with AI-written conclusions.",
        "category": "Data Science",
        "stack": ["Python", "Flask", "pandas", "GCP Cloud Run", "OpenAI"],
        "image": "images/projects/football_analytics.webp",
        "excerpt": "25 years of club ELO ratings, five chart types generated on demand by a plotting microservice, and a GPT-4o button that explains what each chart shows.",
        "demo": "/dashboard_index",
        "template": "data-science/football-dashboard.html",
    },
    {
        "slug": "excel-course",
        "title": "Excel 365 Course Platform",
        "subtitle": "A self-built learning platform: 36 interactive modules, practice files, graded submissions and Stripe payments.",
        "category": "Web Development",
        "stack": ["Flask", "Supabase", "Stripe", "React (JSX)", "openpyxl"],
        "image": "images/projects/excel_course.webp",
        "excerpt": "Instead of renting a course platform I built one: auth and storage on Supabase, checkout on Stripe, an admin panel to review student workbooks, and modules written as React components.",
        "demo": "/curso",
        "template": "web-development/excel-course.html",
    },
    {
        "slug": "brisa-sites",
        "title": "Brisa Sites",
        "subtitle": "A web-design service for small Hispanic businesses in South Florida and Colombia, from pricing model to landing pages.",
        "category": "Web Development",
        "stack": ["Next.js", "HTML/CSS", "SEO", "GA4", "Stripe / Wompi"],
        "image": "images/projects/brisa_sites.webp",
        "excerpt": "Six vertical landing pages, a bilingual ES/EN toggle, two regional price lists and a WhatsApp-first funnel — the business side of building websites.",
        "demo": "https://brisasites.com",
        "template": "web-development/brisa-sites.html",
    },
    {
        "slug": "sonic-surprise",
        "title": "Sonic Surprise & Playlists Qualifier",
        "subtitle": "Two small experiments with the Spotify API: AI song recommendations and a popularity score for your playlists.",
        "category": "Data Science",
        "stack": ["Python", "Flask", "Spotify API", "OpenAI"],
        "image": "images/projects/sonic_surprise.webp",
        "excerpt": "What I learned shipping two tiny apps on top of third-party APIs — including what happens when the provider changes the rules and how to degrade gracefully.",
        "demo": "/openai",
        "template": "data-science/sonic-surprise.html",
    },
    {
        "slug": "gato-tuerto",
        "title": "El Gato Tuerto — Liquor Store",
        "subtitle": "From an online menu to a full eCommerce platform, one weekly demo at a time.",
        "category": "Web Development",
        "stack": ["React", "JavaScript", "MongoDB", "Vercel"],
        "image": "images/projects/gato_tuerto.webp",
        "excerpt": "How continuous feedback from the owner turned a simple catalog into a store with checkout, delivery integration and a marketing plan.",
        "demo": "https://www.elgatotuerto.com",
        "template": "web-development/gato-tuerto.html",
    },
    {
        "slug": "kmeans",
        "title": "Item Classification with K-Means",
        "subtitle": "Replacing a manual winner/regular/loser rating with a clustering model the business could trust.",
        "category": "Data Science",
        "stack": ["Python", "scikit-learn", "Power BI"],
        "image": "images/blogpost/kmeans-3.webp",
        "excerpt": "Analysts rated every item by hand. A clustering model — and an uncomfortable conversation about the number of categories — reached 85% accuracy.",
        "template": "data-science/kmeans.html",
    },
    {
        "slug": "distribucion-sobrantes",
        "title": "Surplus Distribution",
        "subtitle": "Deciding which store should receive leftover stock, automatically.",
        "category": "Data Science",
        "stack": ["Python", "pandas"],
        "image": "images/blogpost/distribucion-sobrantes-2.webp",
        "excerpt": "Four analysts reviewed items one by one. A rotation-weighted metric and a store × item matrix cut the time spent on the task by 80%.",
        "template": "data-science/distribucion-sobrantes.html",
    },
    {
        "slug": "predict-calification",
        "title": "Rating Prediction Pipeline",
        "subtitle": "Data preparation, processing and model training to predict how new items will perform.",
        "category": "Data Science",
        "stack": ["Python", "scikit-learn", "SQLAlchemy"],
        "image": None,
        "excerpt": "Three scripts that merge shipments, master data and historical ratings, then train a neural network, a decision tree and KNN to predict item ratings.",
        "template": "data-science/predict-calification.html",
    },
    {
        "slug": "motivai",
        "title": "MotivAI",
        "subtitle": "A Swift iOS app with an OpenAI-powered coach for habits and motivation.",
        "category": "Mobile Development",
        "stack": ["Swift", "SwiftUI", "Firebase", "OpenAI"],
        "image": "images/projects/motivai.webp",
        "excerpt": "Built with two colleagues: onboarding with Firebase Auth, habit tracking, and a chatbot whose mood adapts to the user.",
        "template": "mobile-development/motivai.html",
    },
    {
        "slug": "raisen",
        "title": "Raisen",
        "subtitle": "AI-generated travel itineraries and city-inspired wallpapers, in one iOS app.",
        "category": "Mobile Development",
        "stack": ["Swift", "Firebase", "OpenAI", "DALL·E"],
        "image": "images/projects/raisen.webp",
        "excerpt": "A solo project: enter a city and a number of days, get a route with places, timings and images — plus a collage generator for wallpapers.",
        "template": "mobile-development/raisen.html",
    },
    {
        "slug": "webscrapping",
        "title": "Web Scraping Toolkit",
        "subtitle": "Automated data collection with Selenium and BeautifulSoup.",
        "category": "Data Science",
        "stack": ["Python", "Selenium", "BeautifulSoup"],
        "image": "images/blogpost/webscraping-1.webp",
        "excerpt": "Scrolling catalogs, cleaning prices and automating logins on streaming services to build datasets ready for analysis.",
        "template": "data-science/webscrapping.html",
    },
    {
        "slug": "macros-excel",
        "title": "Excel VBA Macros for Inventory",
        "subtitle": "Five macros that consolidate warehouse data and generate reports with one click.",
        "category": "Data Science",
        "stack": ["Excel", "VBA"],
        "image": "images/blogpost/macros-excel-1.webp",
        "excerpt": "Pivot tables, lookups and conditional formatting wired together in VBA to replace hours of manual inventory work.",
        "template": "data-science/macros-excel.html",
    },
    {
        "slug": "portfolio",
        "title": "Building This Portfolio",
        "subtitle": "Five versions, from static HTML to React and back to Python + Jinja.",
        "category": "Web Development",
        "stack": ["Flask", "Jinja", "React", "Vercel"],
        "image": "images/blogpost/portfolio-5.webp",
        "excerpt": "Why the site went through five iterations, what each one taught me, and why server-side rendering won in the end.",
        "template": "web-development/portfolio.html",
    },
]

CATEGORIES = ["Data Science", "Web Development", "Mobile Development"]
_BY_SLUG = {cs["slug"]: cs for cs in CASE_STUDIES}


@blogpost_bp.route('/blogpost')
def index():
    return render_template('blogpost/index_blogpost.html',
                           case_studies=CASE_STUDIES, categories=CATEGORIES)


@blogpost_bp.route('/blogpost/<slug>')
def case_study(slug):
    cs = _BY_SLUG.get(slug)
    if cs is None:
        abort(404)
    idx = CASE_STUDIES.index(cs)
    prev_cs = CASE_STUDIES[idx - 1] if idx > 0 else None
    next_cs = CASE_STUDIES[idx + 1] if idx < len(CASE_STUDIES) - 1 else None
    return render_template(f"blogpost/projects/{cs['template']}",
                           cs=cs, prev_cs=prev_cs, next_cs=next_cs)
