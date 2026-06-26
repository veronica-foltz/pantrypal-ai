from pydantic import BaseModel
from datetime import date
from typing import Optional

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