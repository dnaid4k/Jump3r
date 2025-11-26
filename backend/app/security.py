from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt

SECRET = "SUPER_SECRET_CHANGE_THIS"
ALGO = "HS256"

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p: str):
    return pwd.hash(p)

def verify_password(raw: str, hashed: str):
    return pwd.verify(raw, hashed)

def make_token(user_id: int, is_admin: bool):
    payload = {
        "sub": str(user_id),
        "is_admin": is_admin,
        "exp": datetime.utcnow() + timedelta(hours=24),
    }
    return jwt.encode(payload, SECRET, algorithm=ALGO)

def decode_token(token: str):
    return jwt.decode(token, SECRET, algorithms=[ALGO])
