from typing import Union, List
from pydantic import BaseModel, EmailStr, constr
from datetime import datetime

class CandidacyCreate(BaseModel):
    offer_id: int
    cover_letter_url: Union[str, None] = None
    resume_url: str
    custom_field: Union[str, None] = None

class Candidacy(BaseModel):
    id: int
    offer_id: int
    
    candidate_id: int
    candidate_name: str
    candidate_email: EmailStr

    company_name: str
    company_email: EmailStr

    created_at: datetime
    skills: List[constr(max_length=255)]
    status: str
    resume_url: str
    cover_letter_url: Union[str, None] = None

    description: Union[str, None] = None

    class Config:
        orm_mode = True
