from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .database import Base, SessionLocal, engine
from .initial_data import ensure_admin_user, seed_products
from .routers import admin, auth, cart, orders, products

app = FastAPI(title='E-Shop API')

app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.cors_origins,
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*'],
)


@app.on_event('startup')
def on_startup():
  db = SessionLocal()
  try:
    Base.metadata.create_all(bind=engine)
    ensure_admin_user(db)
    seed_products(db)
  finally:
    db.close()


@app.get('/')
def read_root():
  return {'message': 'E-Shop backend is running'}


app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)
