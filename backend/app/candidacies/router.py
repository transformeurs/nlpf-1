from backend.app.candidate.schemas import Candidate
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session

from . import schemas, crud, models

from ..dependencies import get_db

from ..account.util import get_current_account
from ..account.models import Account

from ..company.router import get_current_company
from ..company.models import Company
from backend.app import candidacies

router = APIRouter()

#TODO be different if it's a company or candidate

# Get candidacy by id, need to be authenticated (company or candidate)
@router.get("/candidacy/{candidacy_id}", response_model=schemas.Candidacy)
async def get_offer_by_id(candidacy_id: int, db: Session = Depends(get_db), _: Account = Depends(get_current_account)):
    candidacy = crud.get_candidacy(db, candidacy_id)
    if candidacy is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    return candidacy

#TODO not sure that get_current_account func get a candidate acc

# Post an offer, need to be authenticated as a Candidate
@router.post("/candidacy", response_model=schemas.Offer)
async def create_candidacy(offer: schemas.CandidacyCreate, db: Session = Depends(get_db), candidate: Candidate = Depends(get_current_account)):
    db_candidacy = crud.create_candidacy(db, offer, candidate.id)
    return db_candidacy

# Update the status of a given candidacy, need to be authenticated as the company's owner
@router.patch("/candidacy", response_model=schemas.Candidacy, status_code=200)
async def update_offer(candidacy: schemas.Candidacy, db: Session = Depends(get_db), company: Company = Depends(get_current_company)):
    db_candidacy = crud.get_candidacy(db, candidacy.id)
    if db_candidacy is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    if db_candidacy.company_id != company.id:
        raise HTTPException(status_code=403, detail="You are not the owner of this offer")

    candidacy = crud.update_status(db, candidacy)
    return candidacy
