from typing import Union, List
import datetime
from ..company.schemas import Company
from pydantic import BaseModel, EmailStr

class OfferCreate(BaseModel):
    title: str
    description: str
    company_id: int
    created_at: Union[datetime.datetime, None] = None
    skills: List[str]

class Offer(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime.datetime
    author: str
    contact: str
    skills: List[str]
    response_time: int
    

    class Config:
        orm_mode = True
