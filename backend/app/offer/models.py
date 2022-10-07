from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class Offer(Base):
    __tablename__ = "offer"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    company_id = Column(Integer, ForeignKey("company.id"), index=True)
    created_at = Column(DateTime(timezone=False), default=datetime.now())
    skills = Column(ARRAY(String(255)))
    location = Column(String, index=True)
    salary = Column(Integer, index=True)
    time = Column(String, index=True)
    start_time = Column(String, index=True)

    company = relationship("Company", back_populates="offers")
