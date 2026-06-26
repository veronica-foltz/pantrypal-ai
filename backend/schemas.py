from pydantic import BaseModel
from datetime import date

class PantryItemCreate(BaseModel):
    name: str
    quantity: int
    category: str | None = None
    expiration_date: date | None = None

class PantryItemResponse(PantryItemCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True