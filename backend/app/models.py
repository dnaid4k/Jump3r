from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.db import Base

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True)
    nickname = Column(String)
    points = Column(Integer)
    level = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
