from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session

from app.db import get_db
from app.security import decode_token


def get_current_user(
    x_token: str = Header(None),
    Authorization: str = Header(None),
):
    token = None
    
    if Authorization:
        token = Authorization.replace("Bearer ", "")
    elif x_token:
        token = x_token
    else:
        raise HTTPException(401, "Missing token")

    try:
        return decode_token(token)
    except:
        raise HTTPException(401, "Invalid token")


def require_admin(payload = Depends(get_current_user)):
    if not payload.get("is_admin"):
        raise HTTPException(403, "Admin only")
    return payload
