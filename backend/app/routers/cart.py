from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from .. import schemas
from ..database import get_db
from ..deps import get_current_active_user, get_locale
from ..i18n import translate
from ..models import CartItem, Product, User

router = APIRouter(prefix="/api/cart", tags=["cart"])


def _get_cart_items(db: Session, user_id: int):
    return (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.user_id == user_id)
        .all()
    )


def _serialize_cart(items):
    total = sum((item.product.price or 0) * item.quantity for item in items)
    cart_items = [schemas.CartItemOut.model_validate(item, from_attributes=True) for item in items]
    return schemas.CartResponse(items=cart_items, total_price=total)


@router.get("", response_model=schemas.CartResponse)
def read_cart(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    items = _get_cart_items(db, current_user.id)
    return _serialize_cart(items)


@router.post("", response_model=schemas.CartResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: schemas.CartItemCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    lang: str = Depends(get_locale),
):
    product = db.query(Product).filter(Product.id == payload.product_id, Product.is_active.is_(True)).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=translate("errors.product_not_found", lang))
    item = (
        db.query(CartItem)
        .filter(CartItem.user_id == current_user.id, CartItem.product_id == payload.product_id)
        .first()
    )
    if item:
        item.quantity += payload.quantity
    else:
        item = CartItem(user_id=current_user.id, product_id=payload.product_id, quantity=payload.quantity)
        db.add(item)
    db.commit()
    items = _get_cart_items(db, current_user.id)
    return _serialize_cart(items)


@router.put("/{item_id}", response_model=schemas.CartResponse)
def update_cart_item(
    item_id: int,
    payload: schemas.CartItemUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    lang: str = Depends(get_locale),
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=translate("errors.product_not_found", lang))
    item.quantity = payload.quantity
    db.commit()
    items = _get_cart_items(db, current_user.id)
    return _serialize_cart(items)


@router.delete("/{item_id}", response_model=schemas.CartResponse)
def delete_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    lang: str = Depends(get_locale),
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=translate("errors.product_not_found", lang))
    db.delete(item)
    db.commit()
    items = _get_cart_items(db, current_user.id)
    return _serialize_cart(items)
