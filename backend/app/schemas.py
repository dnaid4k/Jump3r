from pydantic import BaseModel

class ScoreIn(BaseModel):
    nickname: str
    points: int
    level: int

class RegisterIn(BaseModel):
    username: str
    email: str
    password: str

class LoginIn(BaseModel):
    username: str
    password: str
