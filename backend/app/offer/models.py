from sqlalchemy import Column, Integer, String, ForeignKey

from ..database import Base

class Offer(Base):
    __tablename__ = "offer"

    id = Column(Integer, primary_key=True, index=True)
