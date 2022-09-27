from fastapi import APIRouter, HTTPException, Depends

from . import schemas, crud

from ..dependencies import get_db
from sqlalchemy.orm import Session

from ..utils import jwt, password

router = APIRouter()

# Returns a JWT token if login is successful
@router.post("/account/login/", response_model=schemas.AccountToken)
async def login_account(account: schemas.AccountLogin, db: Session = Depends(get_db)):
    db_account = crud.get_account_by_email(db, email=account.email)

    if not db_account:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not password.verify_password(account.password, db_account.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = jwt.create_access_token(data={"sub": db_account.email})

    return { "access_token": access_token }
