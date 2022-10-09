import datetime
from sqlalchemy.orm import Session

from . import models, schemas

def get_candidacy(db: Session, candidacy_id: int):
    return db.query(models.Candidacy).filter(models.Candidacy.id == candidacy_id).first()

def create_candidacy(db: Session, candidacy: schemas.CandidacyCreate, candidate_id: int):
    db_candidacy = models.Candidacy(
        candidate_id=candidate_id,
        created_at=datetime.datetime.now(),
        status = "pending",
        **candidacy.dict() # put the rest of the attributes already set
    )
    db.add(db_candidacy)

    db.commit()
    db.refresh(db_candidacy)
    return db_candidacy

def update_status(db: Session, candidacy: schemas.Candidacy):
    db_candidacy = db.query(models.Candidacy).filter(models.Candidacy.id == candidacy.id).one_or_none()
    if not db_candidacy:
        raise ValueError("Candidacy not found")

    # Update values that need to be updated
    for var, value in vars(candidacy).items():
        setattr(db_candidacy, var, value) if value else None

    db.add(db_candidacy)
    db.commit()
    db.refresh(db_candidacy)
    return db_candidacy