from sqlalchemy.orm import Session

from ..company.models import Company

from . import models, schemas

def get_offer(db: Session, offer_id: int):
    return db.query(models.Offer).filter(models.Offer.id == offer_id).first()

def get_offers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Offer).offset(skip).limit(limit).all()

def create_offer(db: Session, offer: schemas.OfferCreate, company_id: int):
    db_offer = models.Offer(
        title = offer.title,
        description = offer.description,
        company_id = company_id,
        created_at = offer.created_at,
        skills = offer.skills
    )
    db.add(db_offer)

    db.commit()
    db.refresh(db_offer)
    return db_offer

def get_offers_by_company(db: Session, company_id: int):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        return None

    return company.offers
