from sqlalchemy.orm import Session

from . import models


def get_account_by_email(db: Session, email: str):
    return db.query(models.Account).filter(models.Account.email == email).first()
