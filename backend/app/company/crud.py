from sqlalchemy.orm import Session

from . import models, schemas
from ..account.models import Account


def get_company(db: Session, company_id: int):
    return db.query(models.Company).filter(models.Company.id == company_id).first()


def get_company_by_email(db: Session, email: str):
    return db.query(models.Company).filter(models.Company.email == email).first()


def get_companies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Company).offset(skip).limit(limit).all()


def create_company(db: Session, company: schemas.CompanyCreate):
    db_account = Account(email=company.email, hashed_password=company.password)
    db.add(db_account)

    db_company = models.Company(
        email=company.email,
        name=company.name,
        photo_url=company.photo_url,
        description=company.description
    )
    db.add(db_company)

    db.commit()
    db.refresh(db_company)
    return db_company
