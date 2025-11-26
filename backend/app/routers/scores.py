from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Score
from app.schemas import ScoreIn

router = APIRouter(tags=["Scores"])


@router.post("/score")
def add_score(data: ScoreIn, db: Session = Depends(get_db)):

    existing = db.query(Score).filter(
        Score.nickname == data.nickname,
        Score.level == data.level
    ).first()

    if existing:
        if data.points > existing.points:
            existing.points = data.points
            db.commit()
            return {"updated": True}

        return {"updated": False}

    new = Score(**data.dict())
    db.add(new)
    db.commit()
    return {"created": True}


@router.get("/leaderboard")
def leaderboard(limit: int = 20, level: int | None = None, db: Session = Depends(get_db)):
    q = db.query(Score)
    if level is not None:
        q = q.filter(Score.level == level)
    return q.order_by(Score.points.desc()).limit(limit).all()
