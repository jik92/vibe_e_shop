import json
from pathlib import Path

from sqlalchemy.orm import Session

from .core.config import settings
from .models import Product, User
from .security import get_password_hash


def load_seed_products() -> list[dict]:
    seed_path = Path(settings.seed_data_path)
    if not seed_path.exists():
        return []
    with seed_path.open("r", encoding="utf-8") as f:
        return json.load(f)


def seed_products(db: Session) -> None:
    if db.query(Product).count() > 0:
        return
    for item in load_seed_products():
        product = Product(
            name=item["name"],
            description=item.get("description", ""),
            price=item.get("price", 0),
            image_url=item.get("image_url"),
            is_active=item.get("is_active", True),
            stock=item.get("stock", 0),
        )
        db.add(product)
    db.commit()


def ensure_admin_user(db: Session) -> None:
    if db.query(User).filter(User.email == settings.admin_email).first():
        return
    admin = User(
        email=settings.admin_email,
        hashed_password=get_password_hash(settings.admin_password),
        is_active=True,
        is_admin=True,
    )
    db.add(admin)
    db.commit()
