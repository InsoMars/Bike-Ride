from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.repository.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    correo = Column(String(100), unique=True, index=True)
    cedula = Column(String(20), unique=True)
    telefono = Column(String(15))
    direccion = Column(String(150))
    # Sin hashing por solicitud
    password = Column(String(200)) 
    verificado = Column(Boolean, default=False)
    
    rol_id = Column(Integer, ForeignKey("roles.id"), default=1) # ID 1 = 'ciudadano'
    
    rol_obj = relationship("Rol", back_populates="usuarios")
    perfil_cliente = relationship("PerfilCliente", back_populates="usuario", uselist=False, cascade="all, delete-orphan")