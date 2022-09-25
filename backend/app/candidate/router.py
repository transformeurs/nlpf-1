from . import schemas, crud
from fastapi import APIRouter, HTTPException, Depends, UploadFile, status
from typing import List
from sqlalchemy.orm import Session
import os

from jose import JWTError
from ..utils import jwt, password
from fastapi.security import OAuth2PasswordBearer

from ..dependencies import get_db, get_s3_resource

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="candidates/login")

router = APIRouter()

@router.get("/candidates/", response_model=List[schemas.Candidate])
def read_candidates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    candidates = crud.get_candidates(db, skip=skip, limit=limit)
    return candidates

@router.get("/candidates/{candidate_id}", response_model=schemas.Candidate)
def read_candidates(candidate_id: int, db: Session = Depends(get_db)):
    candidate = crud.get_candidate(db, candidate_id=candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

# Candidate Subscription -------------------------------------------------------


@router.post("/candidates/", response_model=schemas.Candidate)
def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate_by_email(db, email=candidate.email)
    if db_candidate:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = password.get_password_hash(candidate.password)
    candidate.password = hashed_password
    return crud.create_candidate(db=db, candidate=candidate)


@router.post("/candidates/uploadImage/")
async def create_upload_file(file: UploadFile):
    s3_resource = get_s3_resource()
    bucket = s3_resource.Bucket('candidate-images')
    obj = bucket.Object(file.filename)
    obj.upload_fileobj(file.file, ExtraArgs={'ContentType': file.content_type})

    return {"filename": f'{os.getenv("AWS_S3_ENDPOINT")}/candidate-images/{obj.key}'}

# Candidate Login --------------------------------------------------------------


# Route that return the current connected candidate with its token
@router.get("/candidates/me/", response_model=schemas.Candidate)
def get_current_candidate(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode_access_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    db_candidate = crud.get_candidate_by_email(db, email=email)
    if db_candidate is None:
        raise credentials_exception
    return db_candidate


# Returns a JWT token if login is successful
@router.post("/candidates/login/", response_model=schemas.CandidateToken)
def login_candidate(candidate: schemas.CandidateLogin, db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate_by_email(db, email=candidate.email)

    if not db_candidate:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not password.verify_password(candidate.password, db_candidate.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = jwt.create_access_token(data={"sub": db_candidate.email})

    return { "access_token": access_token }
