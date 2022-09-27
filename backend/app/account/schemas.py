from pydantic import BaseModel, EmailStr

class AccountLogin(BaseModel):
    email: EmailStr
    password: str

class AccountToken(BaseModel):
    access_token: str
