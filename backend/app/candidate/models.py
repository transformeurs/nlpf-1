from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..candidacies.models import Candidacy # Import needed to make Candidacy available in the Candidate model

from ..database import Base

class Candidate(Base):
    __tablename__ = "candidate"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, ForeignKey("account.email"), unique=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    photo_url = Column(String, index=True)
    description = Column(String, index=True)
    pronouns = Column(String, index=True)

    candidacies = relationship("Candidacy", back_populates="candidate")