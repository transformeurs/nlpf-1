from . import schemas, crud
from fastapi import APIRouter, HTTPException, Depends, UploadFile
from typing import List
from sqlalchemy.orm import Session

from ..utils import password, s3

from ..dependencies import get_db, get_s3_resource

from ..account.util import get_current_account
from ..account.models import Account

router = APIRouter()

@router.get("/companies", response_model=List[schemas.Company])
async def read_companies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    companies = crud.get_companies(db, skip=skip, limit=limit)
    return companies

@router.get("/companies/{company_id}", response_model=schemas.Company)
async def read_companies(company_id: int, db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id=company_id)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

# Company Subscription -------------------------------------------------------

@router.post("/companies", response_model=schemas.Company)
async def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
    db_company = crud.get_company_by_email(db, email=company.email)
    if db_company:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = password.get_password_hash(company.password)
    company.password = hashed_password
    return crud.create_company(db=db, company=company)


@router.post("/companies/uploadImage")
async def upload_profile_picture(file: UploadFile, s3_resource: Session = Depends(get_s3_resource)):
    return s3.upload_file_to_bucket(s3_resource, 'company-images', file)

# Company Login --------------------------------------------------------------

# Given a connected account, return the company associated with it. If no
# company is associated with it (e.g. a company) return an error.
async def get_current_company(account: Account = Depends(get_current_account), db: Session = Depends(get_db)):
    db_company = crud.get_company_by_email(db, email=account.email)

    # In case the account is not a company (e.g. a company)
    if not db_company:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return db_company

# Route that return the current connected company with its token
@router.get("/companies/me/", response_model=schemas.Company)
async def get_me(company: schemas.Company = Depends(get_current_company)):
    return company
