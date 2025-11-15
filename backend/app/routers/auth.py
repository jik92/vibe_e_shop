from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..core.config import settings
from ..database import get_db
from ..deps import get_current_active_user, get_locale
from ..i18n import translate
from ..models import User
from ..security import create_access_token, get_password_hash, verify_password

router = APIRouter(prefix='/api/auth', tags=['auth'])


def create_token_for_user(user: User) -> schemas.Token:
  token = create_access_token(str(user.id), timedelta(minutes=settings.access_token_expire_minutes))
  return schemas.Token(access_token=token)


@router.post('/register', response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(
  user_in: schemas.UserCreate, db: Session = Depends(get_db), lang: str = Depends(get_locale)
):
  existing = db.query(User).filter(User.email == user_in.email).first()
  if existing:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST, detail=translate('errors.user_exists', lang)
    )
  user = User(
    email=user_in.email,
    hashed_password=get_password_hash(user_in.password),
    is_active=True,
    is_admin=False,
  )
  db.add(user)
  db.commit()
  db.refresh(user)
  return user


@router.post('/login', response_model=schemas.Token)
def login(
  user_in: schemas.UserLogin, db: Session = Depends(get_db), lang: str = Depends(get_locale)
):
  user = db.query(User).filter(User.email == user_in.email).first()
  if not user or not verify_password(user_in.password, user.hashed_password):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED, detail=translate('errors.invalid_credentials', lang)
    )
  return create_token_for_user(user)


@router.get('/me', response_model=schemas.UserOut)
def read_me(current_user: User = Depends(get_current_active_user)):
  return current_user
