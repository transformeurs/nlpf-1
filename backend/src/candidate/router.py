from . import schemas, crud
from fastapi import APIRouter, HTTPException, Depends, UploadFile
from typing import List
from sqlalchemy.orm import Session
import os

from ..dependencies import get_db, get_s3_resource

router = APIRouter()

@router.post("/candidates/", response_model=schemas.Candidate)
def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate_by_email(db, email=candidate.email)
    if db_candidate:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_candidate(db=db, candidate=candidate)


@router.get("/candidates/", response_model=List[schemas.Candidate])
def read_candidates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    candidates = crud.get_candidates(db, skip=skip, limit=limit)
    return candidates

@router.post("/candidates/uploadImage/")
async def create_upload_file(file: UploadFile):
    s3_resource = get_s3_resource()
    bucket = s3_resource.Bucket('candidate-images')
    obj = bucket.Object(file.filename)
    obj.upload_fileobj(file.file, ExtraArgs={'ContentType': file.content_type})

    return {"filename": f'{os.getenv("AWS_S3_ENDPOINT")}/candidate-images/{obj.key}'}
