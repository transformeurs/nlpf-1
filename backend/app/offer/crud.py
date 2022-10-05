from sqlalchemy.orm import Session

from . import models, schemas


def get_company(db: Session, offer_id: int):
    return db.query(models.Offer).filter(models.Offer.id == offer_id).first()
