# E-Shop

A full-stack e-commerce demo that pairs a FastAPI backend with a React + Vite frontend. It delivers localized UX, JWT authentication, shopping cart, and order workflows, plus an SEO-ready static homepage generated via Vite's SSR build pipeline.

![Product walkthrough](demo.gif)

![img.png](img.png)

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy ORM, PostgreSQL, JWT auth, seed data + i18n JSON files.
- **Frontend**: React 18, Vite, TanStack Router & Query, i18next, helmet-based meta tags, static homepage pre-rendered via `vite build --ssr`.
- **Infrastructure**: Docker Compose orchestration for PostgreSQL, backend, and frontend services. One command builds and boots everything.

## Getting Started

```bash
docker-compose up --build
```

Services:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000/docs
- Database: PostgreSQL on localhost:5432 (credentials below)

The frontend build step automatically pre-renders the homepage into `frontend/dist/index.html`, so bots get a fully populated product list without running JavaScript.

Set `VITE_SITE_URL` in your environment (or Docker `frontend` service) to ensure canonical/OG links emit the correct absolute domain. Defaults to `http://localhost:3000`.

## Development Mode (Hot Reload)

For live reload on both FastAPI and Vite, use the dev compose file:

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Backend: `uvicorn --reload` watches `backend/` + `shared/`.
- Frontend: `pnpm dev --host` runs from your mounted `frontend/` directory; edits trigger instant HMR.

Stop with `Ctrl+C` and remove containers via `docker compose ... down` when finished.

## Default Data & Credentials

- Database: `postgresql://eshop:eshop@localhost:5432/eshop`
- Admin user: `admin@example.com` / `admin123`
- Seed products: See `shared/products_seed.json`

You can register new shoppers from the `/register` page or log in with the admin user for CMS endpoints.

## Project Structure

```
backend/    FastAPI application (models, routers, i18n, seeding)
frontend/   React app (TanStack Router/Query, i18n, SSR script)
shared/     Seed data shared by backend + prerenderer
docker-compose.yml
Dockerfile.backend
Dockerfile.frontend
```
