from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer

from ..utils import jwt
from . import crud

from ..dependencies import get_db
from sqlalchemy.orm import Session

from jose import JWTError


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="account/token")

# Function that return the current connected account based on JWT Token in the
# headers
async def get_current_account(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode_access_token(token)
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    db_account = crud.get_account_by_email(db, email=email)
    if db_account is None:
        raise credentials_exception
    return db_account
