You are a senior full-stack engineer.

Help me generate a complete E-Commerce Web App with:
	•	Backend: FastAPI + PostgreSQL + SQLAlchemy
	•	Frontend: React + Vite + TanStack Router + TanStack Query
	•	SEO-friendly static homepage (no Next.js)
	•	Full i18n support
	•	Docker Compose one-click startup

The final result MUST be a fully runnable project.

⸻

1. General Tech Requirements

Backend
	•	FastAPI
	•	PostgreSQL
	•	SQLAlchemy ORM
	•	JWT authentication
	•	Shopping cart, product list, product detail, inventory, order workflow
	•	CMS basics (admin product management)
	•	Built-in i18n structure (simple translation files or translation function)

Frontend
	•	React 18
	•	Vite build tool
	•	TanStack Router for routing
	•	TanStack Query for data fetching (no useEffect for data loading)
	•	i18next or similar for i18n
	•	SEO-friendly pre-rendered static homepage using:
	•	vite-plugin-ssg OR vite build --ssr + static HTML output (choose one and implement it fully)
	•	DO NOT use useEffect for data fetching
	•	Instead use loaders / TanStack Query / server-driven hydration
	•	Pages must include:
	•	/ Home (SEO static HTML)
	•	/login
	•	/register
	•	/onboarding
	•	/products/:id Product detail
	•	/cart
	•	/orders
	•	/orders/:id

Infrastructure
	•	Pure Docker Compose with three services:
	•	db (postgres)
	•	backend (FastAPI)
	•	frontend (React + Vite SSR/static build)

Running:

docker-compose up --build

should bring everything online.

⸻

2. Backend (FastAPI) — Requirements

Implement a complete backend with:

2.1 Models (SQLAlchemy)

User
	•	id
	•	email
	•	hashed_password
	•	is_active
	•	is_admin
	•	created_at / updated_at

Product
	•	id
	•	name
	•	description
	•	price
	•	image_url
	•	is_active (on/off shelf)
	•	stock
	•	created_at / updated_at

CartItem
	•	id
	•	user_id
	•	product_id
	•	quantity
	•	created_at / updated_at

Order
	•	id
	•	user_id
	•	status
	•	total_price
	•	created_at / updated_at

OrderItem
	•	id
	•	order_id
	•	product_id
	•	quantity
	•	unit_price
	•	subtotal_price

2.2 API Endpoints

Auth
	•	POST /api/auth/register
	•	POST /api/auth/login
	•	GET  /api/auth/me

Products (public)
	•	GET /api/products
	•	GET /api/products/{id}

Cart
	•	GET /api/cart
	•	POST /api/cart
	•	PUT  /api/cart/{cart_item_id}
	•	DELETE /api/cart/{cart_item_id}

Orders
	•	POST /api/orders
	•	GET /api/orders
	•	GET /api/orders/{id}

CMS (Admin only)
	•	POST /api/admin/products
	•	PUT /api/admin/products/{id}
	•	PATCH /api/admin/products/{id}/toggle-active

2.3 Backend i18n
	•	Provide a simple translation mechanism:
	•	Ex: /locales/en.json, /locales/zh.json
	•	A small helper function translate(key, lang) for system messages.

2.4 Init Script

On startup:
	•	Create tables
	•	Seed sample products (electronics: phone, laptop, etc.)

⸻

3. Frontend (React + Vite + TanStack) — Requirements

3.1 Router

Use TanStack Router with loader-based data fetching:
	•	No useEffect for data loading
	•	Use loader() OR TanStack Query’s queryFn()

Example:

const productRoute = new Route({
  path: "/products/:id",
  loader: ({ params }) => api.getProduct(params.id),
});

3.2 TanStack Query
	•	All API calls should go through TanStack Query
	•	Prefetch data whenever possible
	•	Use Query + Router Loader combination for SSR/static hydration

3.3 i18n

Use i18next with:
	•	locales/en/*.json
	•	locales/zh/*.json
	•	language toggle button in header

3.4 Pages

/ Home (SEO static build)
	•	Pre-render product list to static HTML
	•	Provide meta tags (<title>, description)
	•	Use Vite SSR or vite-plugin-ssg to generate /dist/index.html

/login, /register

Simple forms calling backend auth APIs.

/products/:id

Loader-based product detail.

/cart

Modify quantity / remove items / show totals.

/orders & /orders/:id

List + detail.

/onboarding

Simple intro page shown after first login.

3.5 Shared Components
	•	Header with:
	•	Home
	•	Cart (with item count)
	•	Orders
	•	Language switcher (EN/中文)
	•	Login/Logout

3.6 API Client

Create a small wrapper:

const api = {
  getProducts: () => query,
  getProduct: (id) => query,
  ...
};

Use environment variable:

VITE_API_BASE_URL=http://backend:8000


⸻

4. Docker Compose Requirements

Place docker-compose.yml at the repo root.

Three services:

db
	•	postgres:16
	•	env:
	•	POSTGRES_DB
	•	POSTGRES_USER
	•	POSTGRES_PASSWORD
	•	volume for persistence

backend
	•	Dockerfile:
	•	install Python deps
	•	run uvicorn app.main:app --host 0.0.0.0 --port 8000
	•	depends_on: db
	•	environment:
	•	DATABASE_URL=postgresql+psycopg2://…

frontend
	•	Dockerfile:
	•	install Node deps
	•	build SSR/static pages
	•	run production server (express or vite preview)
	•	environment:
	•	VITE_API_BASE_URL=http://backend:8000

Running:

docker-compose up --build

should:
	•	Build frontend SSR static homepage
	•	Start React/Vite application at http://localhost:3000
	•	Start FastAPI backend at http://localhost:8000
	•	Start PostgreSQL

⸻

5. Repository Structure

backend/
  app/
    main.py
    models.py
    schemas.py
    routers/
      auth.py
      products.py
      cart.py
      orders.py
      admin.py
    i18n/
      en.json
      zh.json
frontend/
  src/
    main.jsx
    router.jsx
    pages/
      Home.jsx
      Login.jsx
      Register.jsx
      ProductDetail.jsx
      Cart.jsx
      Orders.jsx
      OrderDetail.jsx
      Onboarding.jsx
    components/
    locales/
      en.json
      zh.json
  vite.config.js
docker-compose.yml
Dockerfile.backend
Dockerfile.frontend
README.md

All files must be generated with real runnable code.

⸻

6. README Requirements

Include:
	•	Project description
	•	Tech stack
	•	How to run:

docker-compose up --build

	•	Default user credentials or instructions to register

⸻

7. Code Quality Rules
	•	No TODOs
	•	No pseudo code
	•	No missing files
	•	No useEffect for data fetching
	•	Use SSR/static build for homepage SEO
	•	Must run fully inside Docker Compose

⸻

8. Final Output Format Required

Codex should output each file like:

docker-compose.yml
<code>

backend/app/main.py
<code>

frontend/src/pages/Home.jsx
<code>

Do NOT skip any necessary file.
# Repository Guidelines

## Project Structure & Module Organization
- `backend/` – FastAPI app with SQLAlchemy models, routers, and i18n JSON files. Entry point `app/main.py`.
- `frontend/` – React 18 app (Vite, TanStack Router/Query, shadcn/ui). SSR assets live under `src/ssr/`.
- `shared/` – Product seed data consumed by both backend and prerender scripts.
- Root-level `Dockerfile.*` and `docker-compose*.yml` wire services together. Static assets such as `demo.gif` live at the repo root alongside the README.

## Build, Test, and Development Commands
- `docker-compose up --build` – builds all services (db, backend, frontend) and runs them in production-like mode.
- `docker compose -f docker-compose.dev.yml up --build` – dev mode with live reload for FastAPI and Vite.
- `pnpm run build` inside `frontend/` – compiles SPA, SSR bundle, and prerendered HTML.
- `ffmpeg -i 2.mp4 ... demo.gif` – regenerate the showcased walkthrough GIF when updating UI flows.

## Coding Style & Naming Conventions
- Backend: Python 3.11, Pydantic models, FastAPI routers grouped under `backend/app/routers/`. Use snake_case for files and functions.
- Frontend: TypeScript + React. Favor functional components, hooks, and TanStack loaders; avoid `useEffect` data fetching.
- Styling: TailwindCSS tokens plus shadcn UI primitives. Prefer default/ghost buttons unless stronger emphasis is required.
- Package management: `pnpm` for frontend, `pip` (requirements.txt) for backend.

## Testing Guidelines
- Backend: add pytest suites under `backend/tests/` (create when adding logic). Cover auth flows, CRUD, and order calculations.
- Frontend: place vitest/react-testing-library specs under `frontend/src/__tests__/`. Snapshot UI only when meaningful; focus on loaders/hooks.
- Run targeted tests (`cd backend && pytest`, `cd frontend && pnpm test`) before opening a PR.

## Commit & Pull Request Guidelines
- Commit messages follow short imperative summaries (`feat: add checkout summary card`). Reference issue IDs when applicable.
- Pull requests should include:
  - Clear description and before/after screenshots or GIFs for UI work.
  - Test plan with commands executed (`pnpm run build`, `docker compose up -d`, etc.).
  - Notes on migrations/data seeds if schema changes occur.
- Keep PRs focused; split large features into smaller, reviewable chunks when possible.
