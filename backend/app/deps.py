from typing import Optional

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from .core.config import settings
from .database import get_db
from .i18n import translate
from .models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login')


def get_locale(accept_language: Optional[str] = Header(default='en')) -> str:
  if not accept_language:
    return 'en'
  primary = accept_language.split(',')[0]
  return primary.split('-')[0] or 'en'


def get_current_user(
  token: str = Depends(oauth2_scheme),
  db: Session = Depends(get_db),
  lang: str = Depends(get_locale),
) -> User:
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail=translate('errors.invalid_credentials', lang),
    headers={'WWW-Authenticate': 'Bearer'},
  )
  try:
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    user_id: Optional[str] = payload.get('sub')
    if user_id is None:
      raise credentials_exception
  except JWTError as exc:
    raise credentials_exception from exc
  user = db.query(User).filter(User.id == int(user_id)).first()
  if user is None:
    raise credentials_exception
  return user


def get_current_active_user(
  current_user: User = Depends(get_current_user),
  lang: str = Depends(get_locale),
) -> User:
  if not current_user.is_active:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST, detail=translate('errors.unauthorized', lang)
    )
  return current_user


def get_current_admin_user(
  current_user: User = Depends(get_current_active_user),
  lang: str = Depends(get_locale),
) -> User:
  if not current_user.is_admin:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN, detail=translate('errors.unauthorized', lang)
    )
  return current_user
