
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.repository.database import Base 

class Rol(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), unique=True, nullable=False)
    
    usuarios = relationship("Usuario", back_populates="rol_obj")