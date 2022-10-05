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

@router.get("/offer")
async def read_companies():
    return {"Hello": "World"}
