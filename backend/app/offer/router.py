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

@router.post("/offers", response_model=schemas.Offer)
async def create_offer(offer: schemas.OfferCreate, db: Session = Depends(get_db)):
    db_offer = crud.create_offer(db, offer)
    
    skills = db_offer.skills.split(",")
    return schemas.Offer(
        id=db_offer.id,
        title=db_offer.title,
        description=db_offer.description,
        created_at=db_offer.created_at,
        author=db_offer.company.name,
        contact=db_offer.company.email,
        skills=skills,
        response_time=0
    )
