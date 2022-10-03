from . import schemas, crud
from fastapi import APIRouter, HTTPException, Depends, UploadFile
from typing import List
from sqlalchemy.orm import Session
import os

from ..utils import password

from ..dependencies import get_db, get_s3_resource

from ..account.util import get_current_account
from ..account.models import Account

router = APIRouter()

@router.get("/candidates", response_model=List[schemas.Candidate])
async def read_candidates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    candidates = crud.get_candidates(db, skip=skip, limit=limit)
    return candidates

@router.get("/candidates/{candidate_id}", response_model=schemas.Candidate)
async def read_candidates(candidate_id: int, db: Session = Depends(get_db)):
    candidate = crud.get_candidate(db, candidate_id=candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

# Candidate Subscription -------------------------------------------------------

@router.post("/candidates", response_model=schemas.Candidate)
async def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate_by_email(db, email=candidate.email)
    if db_candidate:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = password.get_password_hash(candidate.password)
    candidate.password = hashed_password
    return crud.create_candidate(db=db, candidate=candidate)


@router.post("/candidates/uploadImage")
async def create_upload_file(file: UploadFile):
    s3_resource = get_s3_resource()
    bucket = s3_resource.Bucket('candidate-images')
    obj = bucket.Object(file.filename)
    obj.upload_fileobj(file.file, ExtraArgs={'ContentType': file.content_type})

    return {"filename": f'{os.getenv("AWS_S3_ENDPOINT")}/candidate-images/{obj.key}'}

# Candidate Login --------------------------------------------------------------

# Given a connected account, return the candidate associated with it. If no
# candidate is associated with it (e.g. a company) return an error.
async def get_current_candidate(account: Account = Depends(get_current_account), db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate_by_email(db, email=account.email)

    # In case the account is not a candidate (e.g. a company)
    if not db_candidate:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return db_candidate

# Route that return the current connected candidate with its token
@router.get("/candidates/me/", response_model=schemas.Candidate)
async def get_me(candidate: schemas.Candidate = Depends(get_current_candidate)):
    return candidate
