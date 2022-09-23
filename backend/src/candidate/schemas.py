from typing import Union
from pydantic import BaseModel

class CandidateCreate(BaseModel):
    name: str
    email: str
    password: str
    photo_url: Union[str, None] = None
    description: Union[str, None] = None
    pronouns: Union[str, None] = None

class Candidate(BaseModel):
    id: int
    name: str
    email: str
    photo_url: Union[str, None] = None
    description: Union[str, None] = None
    pronouns: Union[str, None] = None
    
    class Config:
        orm_mode = True