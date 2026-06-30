from pydantic import BaseModel
from datetime import date
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

class PantryItemCreate(BaseModel):
    name: str
    quantity: int
    category: Optional[str] = None
    expiration_date: Optional[date] = None

class PantryItemResponse(PantryItemCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True