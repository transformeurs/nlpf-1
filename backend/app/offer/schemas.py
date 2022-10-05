from typing import Union
from pydantic import BaseModel, EmailStr

class CompanyCreate(BaseModel):
    id: int

class Company(BaseModel):
    id: int

    class Config:
        orm_mode = True
