from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from . import schemas, crud, models

from ..dependencies import get_db

from ..account.util import get_current_account
from ..account.models import Account

from ..company.router import get_current_company
from ..company.models import Company
from ..candidate.router import get_current_candidate
from ..candidate.models import Candidate
from ..offer.crud import get_offer

router = APIRouter()

# Convert a models.Candidacy into a schemas.Candidacy
def convert_to_schema(candidacy: models.Candidacy) -> schemas.Candidacy:
    return schemas.Candidacy(
        id=candidacy.id,
        offer_id=candidacy.offer_id,
        candidate_id=candidacy.candidate_id,
        candidate_name=candidacy.candidate.name,
        candidate_email=candidacy.candidate.email,
        company_name=candidacy.offer.company.name,
        company_email=candidacy.offer.company.email,
        created_at=candidacy.created_at,
        skills=candidacy.offer.skills,
        status=candidacy.status,
        resume_url=candidacy.resume_url,
        cover_letter_url=candidacy.cover_letter_url,
        offer_description=candidacy.offer.description
    )

# Get candidacy by id, need to be authenticated (company or candidate)
# If company, need to be the company that created the offer
# If candidate, need to be the candidate that created the candidacy
@router.get("/candidacies/{candidacy_id}", response_model=schemas.Candidacy)
async def get_candidacy_by_id(candidacy_id: int, db: Session = Depends(get_db), account: Account = Depends(get_current_account)):
    candidacy = crud.get_candidacy(db, candidacy_id)
    if candidacy is None:
        raise HTTPException(status_code=404, detail="Candidacy not found")

    candidate = None
    company = None
    try:
        candidate = await get_current_candidate(account, db)
    except HTTPException:
        company = await get_current_company(account, db)

    if company and company.id != candidacy.offer.company_id:
        raise HTTPException(status_code=403, detail="You are not the owner of this offer")
    if candidate and candidate.id != candidacy.candidate_id:
        raise HTTPException(status_code=403, detail="You are not the owner of this candidacy")

    return convert_to_schema(candidacy)

# Create a candidacy, need to be authenticated as a Candidate
@router.post("/candidacies", response_model=schemas.Candidacy)
async def create_candidacy(candidacy: schemas.CandidacyCreate, db: Session = Depends(get_db), candidate: Candidate = Depends(get_current_candidate)):
    db_candidacy = crud.create_candidacy(db, candidacy, candidate.id)
    return convert_to_schema(db_candidacy)

# Update the status of a given candidacy, need to be authenticated as company that can manager the offer
@router.patch("/candidacies", response_model=schemas.Candidacy, status_code=200)
async def update_candidacy(candidacy: schemas.CandidacyUpdateStatus, db: Session = Depends(get_db), company: Company = Depends(get_current_company)):
    db_candidacy = crud.get_candidacy(db, candidacy.id)
    if db_candidacy is None:
        raise HTTPException(status_code=404, detail="Candidacy not found")
    if db_candidacy.offer.company_id != company.id:
        raise HTTPException(status_code=403, detail="You are not the owner of this offer")

    candidacy = crud.update_status(db, candidacy)
    return convert_to_schema(candidacy)

# Get all candidacies associated to an offer, need to be authenticated as the offer's owner
@router.get("/offers/{offer_id}/candidacies", response_model=List[schemas.Candidacy])
async def get_offer_candidacies(offer_id: int, db: Session = Depends(get_db), company: Company = Depends(get_current_company)):
    offer = get_offer(db, offer_id)
    if offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    if offer.company_id != company.id:
        raise HTTPException(status_code=403, detail="You are not the owner of this offer")

    candidacies = offer.candidacies
    result = []
    for candidacy in candidacies:
        result.append(convert_to_schema(candidacy))
    return result

# Get all candidacies associated to a candidate, need to be authenticated as the candidate
@router.get("/candidates/candidacies/", response_model=List[schemas.Candidacy])
async def get_candidate_candidacies(candidate: Candidate = Depends(get_current_candidate)):
    candidacies = candidate.candidacies
    result = []
    for candidacy in candidacies:
        result.append(convert_to_schema(candidacy))
    return result