from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class Message(BaseModel):
    message: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserLogin(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        orm_mode = True


class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: Optional[str]
    stock: int
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    price: Optional[float]
    image_url: Optional[str]
    stock: Optional[int]
    is_active: Optional[bool]


class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)


class CartProduct(BaseModel):
    id: int
    name: str
    price: float
    image_url: Optional[str]

    class Config:
        orm_mode = True


class CartItemOut(BaseModel):
    id: int
    quantity: int
    product: CartProduct

    class Config:
        orm_mode = True


class CartResponse(BaseModel):
    items: List[CartItemOut]
    total_price: float


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    subtotal_price: float
    product: Optional[CartProduct]

    class Config:
        orm_mode = True


class OrderOut(BaseModel):
    id: int
    status: str
    total_price: float
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        orm_mode = True
