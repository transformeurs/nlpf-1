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
    title: Union[str, None] = None
    description: Union[str, None] = None
    created_at: Union[datetime, None] = None
    author: Union[str, None] = None
    contact: Union[str, None] = None
    skills: Union[List[constr(max_length=255)], None] = None
    response_time: Union[int, None] = None

    class Config:
        orm_mode = True
