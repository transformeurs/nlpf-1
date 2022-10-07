from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session

from . import schemas, crud, models

from ..dependencies import get_db

from ..account.util import get_current_account
from ..account.models import Account

from ..company.router import get_current_company
from ..company.models import Company

router = APIRouter()

# Convert a models.Offer into a schemas.Offer
def convert_db_offer_to_offer(offer: models.Offer):
    return schemas.Offer(
        id = offer.id,
        title = offer.title,
        description = offer.description,
        author = offer.company.name,
        contact = offer.company.email,
        created_at = offer.created_at,
        skills = offer.skills,
        location=offer.location,
        salary=offer.salary,
        time=offer.time,
        start_time=offer.start_time,
        response_time=0
    )

# Get offer by id, need to be authenticated (company or candidate)
@router.get("/offers/{offer_id}", response_model=schemas.Offer)
async def get_offer_by_id(offer_id: int, db: Session = Depends(get_db), _: Account = Depends(get_current_account)):
    offer = crud.get_offer(db, offer_id)
    if offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    return convert_db_offer_to_offer(offer)

# Delete offer by ID, need to be authenticated as the offer's owner
@router.delete("/offers/{offer_id}", status_code=200)
async def delete_offer_by_id(offer_id: int, db: Session = Depends(get_db), company: Company = Depends(get_current_company)):
    offer = crud.get_offer(db, offer_id)
    if offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")

    if offer.company_id != company.id:
        raise HTTPException(status_code=403, detail="You are not the owner of this offer")

    crud.delete_offer(db, offer_id)
    return {"message": "Offer deleted"}

# Get all offers, need to be authenticated (candidate or company)
@router.get("/offers", response_model=List[schemas.Offer])
async def get_offers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _: Account = Depends(get_current_account)):
    db_offers = crud.get_offers(db, skip=skip, limit=limit)

    # Transform the data to respect the schema
    offers = []
    for db_offer in db_offers:
        offers.append(convert_db_offer_to_offer(db_offer))

    return offers

# Post an offer, need to be authenticated as a company
@router.post("/offers", response_model=schemas.Offer)
async def create_offer(offer: schemas.OfferCreate, db: Session = Depends(get_db), company: Company = Depends(get_current_company)):
    db_offer = crud.create_offer(db, offer, company.id)
    return convert_db_offer_to_offer(db_offer)

# Update in place an offer, need to be authenticated as the offer's owner
@router.patch("/offers", response_model=schemas.Offer, status_code=200)
async def update_offer(offer: schemas.Offer, db: Session = Depends(get_db), company: Company = Depends(get_current_company)):
    db_offer = crud.get_offer(db, offer.id)
    if db_offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    if db_offer.company_id != company.id:
        raise HTTPException(status_code=403, detail="You are not the owner of this offer")

    offer = crud.update_offer(db, offer)
    return convert_db_offer_to_offer(offer)

# Get all offers of a given company, need to be authenticated (candidate or company)
@router.get("/companies/{company_id}/offers", response_model=List[schemas.Offer])
async def get_company_offers(company_id: int, db: Session = Depends(get_db), _: Account = Depends(get_current_account)):
    try:
        db_offers = crud.get_offers_by_company(db, company_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Company not found")

    if not db_offers:
        return []

    # Transform the data to respect the schema
    offers = []
    for db_offer in db_offers:
        offers.append(convert_db_offer_to_offer(db_offer))

    return offers
