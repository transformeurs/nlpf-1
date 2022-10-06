from typing import Union, List
from datetime import datetime
from pydantic import BaseModel, constr

class OfferCreate(BaseModel):
    title: str
    description: str
    created_at: Union[datetime, None] = None
    skills: List[constr(max_length=255)]

class Offer(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime
    author: str
    contact: str
    skills: List[constr(max_length=255)]
    response_time: int

    class Config:
        orm_mode = True
