from sqlalchemy import Column, Integer, String
from ..database import Base

class Candidate(Base):
    __tablename__ = "candidate"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    photo_url = Column(String, index=True)
    description = Column(String, index=True)
    pronouns = Column(String, index=True)