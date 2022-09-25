from sqlalchemy.orm import Session

from . import models, schemas
import bcrypt


def get_candidate(db: Session, candidate_id: int):
    return db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()


def get_candidate_by_email(db: Session, email: str):
    return db.query(models.Candidate).filter(models.Candidate.email == email).first()


def get_candidates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Candidate).offset(skip).limit(limit).all()


def create_candidate(db: Session, candidate: schemas.CandidateCreate):
    hashed_password = bcrypt.hashpw(candidate.password.encode(), bcrypt.gensalt())
    db_candidate = models.Candidate(
        name=candidate.name,
        email=candidate.email,
        hashed_password=hashed_password,
        photo_url=candidate.photo_url,
        description=candidate.description,
        pronouns=candidate.pronouns
    )
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate