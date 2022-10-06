from fastapi import APIRouter, HTTPException, Depends, UploadFile
from typing import List
from sqlalchemy.orm import Session

from . import schemas, crud, models
from ..utils import password

from ..dependencies import get_db, get_s3_resource

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
        response_time=0
    )

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

# Get all offers of a given company, need to be authenticated (candidate or company)
@router.get("/companies/{company_id}/offers", response_model=List[schemas.Offer])
async def get_company_offers(company_id: int, db: Session = Depends(get_db), _: Account = Depends(get_current_account)):
    db_offers = crud.get_offers_by_company(db, company_id)

    if not db_offers:
        raise HTTPException(status_code=404, detail="Company not found")

    # Transform the data to respect the schema
    offers = []
    for db_offer in db_offers:
        offers.append(convert_db_offer_to_offer(db_offer))

    return offers
