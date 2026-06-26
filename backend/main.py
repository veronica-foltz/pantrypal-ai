from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

import models
import schemas

from database import engine, Base, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "Welcome to PantryPal AI!"
    }

@app.post("/pantry-items")
def create_pantry_item(
    pantry_item: schemas.PantryItemCreate,
    db: Session = Depends(get_db)
):
    db_item = models.PantryItem(
        name=pantry_item.name,
        quantity=pantry_item.quantity,
        category=pantry_item.category,
        expiration_date=pantry_item.expiration_date,
        user_id=1
    )

    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return db_item