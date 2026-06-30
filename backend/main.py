from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas

from database import engine, Base, get_db
from security import hash_password, verify_password

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "Welcome to PantryPal AI!"
    }

@app.post("/register", response_model=schemas.UserResponse)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

@app.post("/login")
def login(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        db_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful!"
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
        user_id=None
    )

    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return db_item

@app.get("/pantry-items")
def get_pantry_items(
    db: Session = Depends(get_db)
):
    items = db.query(models.PantryItem).all()
    return items

@app.get("/pantry-items/{item_id}")
def get_pantry_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    item = db.query(models.PantryItem).filter(
        models.PantryItem.id == item_id
    ).first()
    
    if item is None:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    
    return item

@app.delete("/pantry-items/{item_id}")
def delete_pantry_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    item = db.query(models.PantryItem).filter(
        models.PantryItem.id == item_id
    ).first()
    
    if item is None:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    
    db.delete(item)
    db.commit()

    return {
        "message": "Pantry item deleted successfully"
    }

@app.put("/pantry-items/{item_id}")
def update_pantry_item(
    item_id: int,
    updated_item: schemas.PantryItemCreate,
    db: Session = Depends(get_db)
):
    item = db.query(models.PantryItem).filter(
        models.PantryItem.id == item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Pantry item not found")

    item.name = updated_item.name
    item.quantity = updated_item.quantity
    item.category = updated_item.category
    item.expiration_date = updated_item.expiration_date

    db.commit()
    db.refresh(item)

    return item