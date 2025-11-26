from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User
from app.dependencies import require_admin

router = APIRouter(tags=["Admin"])


@router.delete("/admin/delete-user/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404)
    
    db.delete(user)
    db.commit()
    
    return {"deleted": True}


@router.get("/admin/users")
def list_users(
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    return db.query(User).all()
