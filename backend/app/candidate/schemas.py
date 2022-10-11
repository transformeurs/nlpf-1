from typing import Union
from pydantic import BaseModel, EmailStr

class CandidateCreate(BaseModel):
    name: str
    age: int
    email: EmailStr
    password: str
    photo_url: Union[str, None] = None
    description: Union[str, None] = None
    pronouns: Union[str, None] = None

class Candidate(BaseModel):
    id: int
    name: str
    age: int
    email: EmailStr
    photo_url: Union[str, None] = None
    description: Union[str, None] = None
    pronouns: Union[str, None] = None

    class Config:
        orm_mode = True
