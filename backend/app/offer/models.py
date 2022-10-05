import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database import Base

class Offer(Base):
    __tablename__ = "offer"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    company_id = Column(String, ForeignKey("company.id"), unique=True, index=True)
    created_at = Column(DateTime(timezone=False), default=datetime.datetime.now())
    skills = Column(String, index=True)

    company = relationship("Company", back_populates="offers")