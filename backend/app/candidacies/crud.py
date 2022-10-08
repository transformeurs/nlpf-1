import datetime
from sqlalchemy.orm import Session

from . import models, schemas
from ..account.models import Account

def get_candidacy(db: Session, candidacy_id: int):
    return db.query(models.Candidacy).filter(models.Candidacy.id == candidacy_id).first()

def get_candidacies_by_candidate(db: Session, candidate_id: int):
    return db.query(models.Candidacy).filter(models.Candidate.id == candidate_id).first()

def get_candidacies_by_company(db: Session, company_id: int):
    return db.query(models.Candidacy).filter(models.Company.id == company_id).first()

def create_candidacy(db: Session, candidacy: schemas.CandidacyCreate):
    db_candidacy = models.Candidacy(
        #candidate_id
        offer_id=candidacy.offer_id,
        created_at=datetime.datetime.now(),
        status = "Waiting",
        cover_letter_url=candidacy.cover_letter_url,
        resume_url=candidacy.resume_url,
        custom_field=candidacy.custom_field
    )
    db.add(db_candidacy)

    db.commit()
    db.refresh(db_candidacy)
    return db_candidacy


def update_status(db: Session, candidacy: schemas.Candidacy):
    db_candidacy = db.query(models.Offer).filter(models.Candidacy.id == candidacy.id).one_or_none()
    if not db_candidacy:
        raise ValueError("Offer not found")

    # Update values that need to be updated
    for var, value in vars(candidacy).items():
        setattr(db_candidacy, var, value) if value else None

    db.add(db_candidacy)
    db.commit()
    db.refresh(db_candidacy)
    return db_candidacy