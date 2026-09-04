from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

import models
import schemas

from database import engine, Base, get_db
from security import hash_password, verify_password, create_access_token, get_current_user

from datetime import date, timedelta

from openai import OpenAI

RECIPES = [
    {
        "name": "French Toast",
        "ingredients": ["eggs", "bread", "milk", "cinnamon"]
    },
    {
        "name": "Scrambled Eggs",
        "ingredients": ["eggs"]
    },
    {
        "name": "Toast",
        "ingredients": ["bread", "butter"]
    },
    {
        "name": "Apple Slices",
        "ingredients": ["apples"]
    }
]

Base.metadata.create_all(bind=engine)

app = FastAPI()

client = OpenAI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(
        models.User.email == form_data.username
    ).first()

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        db_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.post("/guest-login", response_model=schemas.Token)
def guest_login(
    db: Session = Depends(get_db)
):
    guest_email = "guest@pantrypal.demo"

    guest_user = db.query(models.User).filter(
        models.User.email == guest_email
    ).first()

    if guest_user is None:
        guest_user = models.User(
            username="Guest",
            email=guest_email,
            hashed_password=hash_password("guest-demo-password")
        )

        db.add(guest_user)
        db.commit()
        db.refresh(guest_user)

    access_token = create_access_token(
        data={"sub": guest_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.post("/pantry-items")
def create_pantry_item(
    pantry_item: schemas.PantryItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_item = models.PantryItem(
        name=pantry_item.name,
        quantity=pantry_item.quantity,
        category=pantry_item.category,
        expiration_date=pantry_item.expiration_date,
        user_id=current_user.id
    )

    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return db_item

@app.get("/pantry-items")
def get_pantry_items(
    search: str = "",
    category: str = "",
    sort_by: str = "name",
    order: str = "asc",
    skip: int = 0,
    limit: int = 10,
    expiring_days: int = 0,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.PantryItem).filter(
        models.PantryItem.user_id == current_user.id,
        models.PantryItem.name.contains(search),
        models.PantryItem.category.contains(category)
    )

    if expiring_days > 0:
        today = date.today()
        end_date = today + timedelta(days=expiring_days)

        query = query.filter(
            models.PantryItem.expiration_date >= today,
            models.PantryItem.expiration_date <= end_date
        )

    if sort_by == "name":
        if order == "desc":
            query = query.order_by(models.PantryItem.name.desc())
        else:
            query = query.order_by(models.PantryItem.name.asc())
    
    if sort_by == "expiration_date":
        if order == "desc":
         query = query.order_by(models.PantryItem.expiration_date.desc())
        else:
            query = query.order_by(models.PantryItem.expiration_date.asc())
    
    items = query.offset(skip).limit(limit).all()

    return items

@app.get("/pantry-items/expiring-soon")
def get_expiring_soon_items(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    today = date.today()
    end_date = today + timedelta(days=days)

    items = db.query(models.PantryItem).filter(
        models.PantryItem.user_id == current_user.id,
        models.PantryItem.expiration_date >= today,
        models.PantryItem.expiration_date <= end_date
    ).order_by(models.PantryItem.expiration_date.asc()).all()

    return items

@app.get("/pantry-items/{item_id}")
def get_pantry_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    item = db.query(models.PantryItem).filter(
        models.PantryItem.id == item_id,
        models.PantryItem.user_id == current_user.id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Pantry item not found")

    return item

@app.delete("/pantry-items/{item_id}")
def delete_pantry_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    item = db.query(models.PantryItem).filter(
        models.PantryItem.id == item_id,
        models.PantryItem.user_id == current_user.id
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
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    item = db.query(models.PantryItem).filter(
        models.PantryItem.id == item_id,
        models.PantryItem.user_id == current_user.id
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

@app.get("/recipes/suggestions")
def get_recipe_suggestions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    pantry_items = db.query(models.PantryItem).filter(
        models.PantryItem.user_id == current_user.id
    ).all()

    ingredients = [item.name.lower() for item in pantry_items]

    suggestions = []

    for recipe in RECIPES:
        required_ingredients = recipe["ingredients"]
        matched_ingredients = [
            ingredient for ingredient in required_ingredients
            if ingredient in ingredients
        ]

        missing_ingredients = [
            ingredient for ingredient in required_ingredients
            if ingredient not in ingredients
        ]

        match_score = (
            len(matched_ingredients) /
            len(required_ingredients)
        ) * 100

        if matched_ingredients:
            suggestions.append({
                "name": recipe["name"],
                "can_make": len(missing_ingredients) == 0,
                "match_score": match_score,
                "matched_ingredients": matched_ingredients,
                "missing_ingredients": missing_ingredients
            })

    suggestions.sort(
        key=lambda recipe: (
            recipe["match_score"],
            recipe["match_score"]
        ),
        reverse=True
    )

    return {
        "pantry_items": ingredients,
        "suggestions": suggestions
    }

@app.post("/recipes/ai-generate")
def generate_ai_recipe(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    pantry_items = db.query(models.PantryItem).filter(
        models.PantryItem.user_id == current_user.id
    ).all()

    ingredients = [
        item.name.lower()
        for item in pantry_items
    ]

    if not ingredients:
        raise HTTPException(
            status_code=400,
            detail="Add pantry items before generating a recipe."
        )

    prompt = f"""
    Create one practical recipe using as many of these pantry ingredients
    as possible:

    {", ".join(ingredients)}

    You may suggest a few basic missing ingredients if necessary.

    Include:
    - Recipe name
    - Ingredients
    - Step-by-step instructions
    - Approximate cooking time

    Keep the recipe simple and easy to follow.
    """

    response = client.responses.create(
        model="gpt-5",
        input=prompt
    )

    return {
        "pantry_items": ingredients,
        "recipe": response.output_text
    }

@app.get("/shopping-list")
def generate_shopping_list(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    pantry_items = db.query(models.PantryItem).filter(
        models.PantryItem.user_id == current_user.id
    ).all()

    ingredients = [item.name.lower() for item in pantry_items]

    shopping_list = []

    for recipe in RECIPES:
        for ingredient in recipe["ingredients"]:
            if ingredient not in ingredients:
                shopping_list.append(ingredient)
    
    shopping_list = list(set(shopping_list))

    return {
        "pantry_items": ingredients,
        "shopping_list": shopping_list
    }

@app.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    pantry_items = db.query(models.PantryItem).filter(
        models.PantryItem.user_id == current_user.id
    ).all()

    total_items = len(pantry_items)

    categories = {
        item.category
        for item in pantry_items
        if item.category is not None
    }

    today = date.today()
    end_date = today + timedelta(days=7)

    expiring_soon = [
        item for item in pantry_items
        if item.expiration_date is not None
        and today <= item.expiration_date <= end_date
    ]

    ingredients = [item.name.lower() for item in pantry_items]

    recipes_available = 0

    for recipe in RECIPES:
        if all(
            ingredient in ingredients
            for ingredient in recipe["ingredients"]
        ):
            recipes_available += 1

    return {
        "total_items": total_items,
        "total_categories": len(categories),
        "expiring_soon": len(expiring_soon),
        "recipes_available": recipes_available
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }