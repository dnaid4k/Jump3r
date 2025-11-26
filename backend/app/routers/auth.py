from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User
from app.schemas import RegisterIn, LoginIn
from app.security import hash_password, verify_password, make_token

router = APIRouter(tags=["Auth"])


@router.post("/register")
def register(data: RegisterIn, db: Session = Depends(get_db)):

    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(400, "username taken")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    return {"ok": True}



@router.post("/login")
def login(data: LoginIn, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == data.username).first()
    if not user:
        raise HTTPException(400, "invalid credentials")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(400, "invalid credentials")

    token = make_token(user.id, user.is_admin)

    return {"token": token, "username": user.username, "is_admin": user.is_admin}
