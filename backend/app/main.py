from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import scores, auth, admin
from app.db import SessionLocal, Base, engine
from app.models import User
from app.security import hash_password

Base.metadata.create_all(bind=engine)


app = FastAPI(title="AlphaJump API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization", "authorization"],
)


db = SessionLocal()

if not db.query(User).filter(User.username == "admin").first():
    admin_user = User(
        username="admin",
        email="admin@example.com",
        hashed_password=hash_password("admin123"),
        is_admin=True
    )
    db.add(admin_user)
    db.commit()
    print("Default admin created: admin / admin123")

db.close()


app.include_router(scores.router)
app.include_router(auth.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "AlphaJump API is running"}