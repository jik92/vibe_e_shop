from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from .. import schemas
from ..database import get_db
from ..deps import get_current_active_user, get_locale
from ..i18n import translate
from ..models import CartItem, Order, OrderItem, Product, User

router = APIRouter(prefix="/api/orders", tags=["orders"])


def _get_order(db: Session, order_id: int, user_id: int):
    return (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order_id, Order.user_id == user_id)
        .first()
    )


@router.post("", response_model=schemas.OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db), lang: str = Depends(get_locale)):
    cart_items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.user_id == current_user.id)
        .all()
    )
    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=translate("errors.cart_empty", lang))

    for item in cart_items:
        if not item.product or item.product.stock < item.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=translate("errors.insufficient_stock", lang))

    order = Order(user_id=current_user.id, status="pending", total_price=Decimal("0"))
    db.add(order)
    db.flush()

    total = Decimal("0")
    for cart_item in cart_items:
        unit_price = Decimal(cart_item.product.price)
        subtotal = unit_price * cart_item.quantity
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            unit_price=unit_price,
            subtotal_price=subtotal,
        )
        db.add(order_item)
        total += subtotal
        product = db.query(Product).filter(Product.id == cart_item.product_id).first()
        if product:
            product.stock -= cart_item.quantity
        db.delete(cart_item)

    order.total_price = total
    db.commit()
    db.refresh(order)
    return _get_order(db, order.id, current_user.id)


@router.get("", response_model=list[schemas.OrderOut])
def list_orders(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order_detail(order_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db), lang: str = Depends(get_locale)):
    order = _get_order(db, order_id, current_user.id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=translate("errors.product_not_found", lang))
    return order
