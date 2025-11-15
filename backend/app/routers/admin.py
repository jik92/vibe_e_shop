from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..database import get_db
from ..deps import get_current_admin_user, get_locale
from ..i18n import translate
from ..models import Product, User

router = APIRouter(prefix='/api/admin/products', tags=['admin'])


@router.post('', response_model=schemas.ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
  payload: schemas.ProductCreate,
  _: User = Depends(get_current_admin_user),
  db: Session = Depends(get_db),
):
  product = Product(**payload.dict())
  db.add(product)
  db.commit()
  db.refresh(product)
  return product


@router.put('/{product_id}', response_model=schemas.ProductOut)
def update_product(
  product_id: int,
  payload: schemas.ProductUpdate,
  _: User = Depends(get_current_admin_user),
  db: Session = Depends(get_db),
  lang: str = Depends(get_locale),
):
  product = db.query(Product).filter(Product.id == product_id).first()
  if not product:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND, detail=translate('errors.product_not_found', lang)
    )
  for key, value in payload.dict(exclude_unset=True).items():
    setattr(product, key, value)
  db.commit()
  db.refresh(product)
  return product


@router.patch('/{product_id}/toggle-active', response_model=schemas.ProductOut)
def toggle_product_active(
  product_id: int,
  _: User = Depends(get_current_admin_user),
  db: Session = Depends(get_db),
  lang: str = Depends(get_locale),
):
  product = db.query(Product).filter(Product.id == product_id).first()
  if not product:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND, detail=translate('errors.product_not_found', lang)
    )
  product.is_active = not product.is_active
  db.commit()
  db.refresh(product)
  return product
