from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base

class Candidacy(Base):
    __tablename__ = "candidacy"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate.id"), index=True)
    offer_id = Column(Integer, ForeignKey("offer.id"), index=True)
    created_at = Column(DateTime(timezone=False), default=datetime.now())
    status = Column(String, index=True)
    cover_letter_url = Column(String, index=True)
    resume_url = Column(String, index=True)
    custom_field = Column(String, index=True)

    UniqueConstraint(candidate_id, offer_id)

    candidate = relationship("Candidate", back_populates="candidacies")
    offer = relationship("Offer", back_populates="candidacies")