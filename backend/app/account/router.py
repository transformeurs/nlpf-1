from fastapi import APIRouter, HTTPException, Depends

from . import schemas, crud

from ..dependencies import get_db
from sqlalchemy.orm import Session

from ..utils import jwt, password

from ..candidate.crud import get_candidate_by_email
from ..company.crud import get_company_by_email

router = APIRouter()

# Returns a JWT token if login is successful
@router.post("/account/login", response_model=schemas.AccountToken)
async def login_account(account: schemas.AccountLogin, db: Session = Depends(get_db)):
    db_account = crud.get_account_by_email(db, email=account.email)

    if not db_account:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not password.verify_password(account.password, db_account.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Check if the account is a candidate or company to fill the JWT token data
    try:
        db_candidate = get_candidate_by_email(db, email=account.email)
        data = {
            "name": db_candidate.name,
            "age": db_candidate.age,
            "email": db_candidate.email,
            "role": "candidate",
            "avatarUrl": db_candidate.photo_url
        }
    except:
        db_company = get_company_by_email(db, email=account.email)
        data = {
            "name": db_company.name,
            "email": db_company.email,
            "role": "company",
            "avatarUrl": db_company.photo_url
        }

    access_token = jwt.create_access_token(data)

    return { "access_token": access_token }
