from sqlalchemy import Column, Integer, String, Boolean
from app.repository.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    correo = Column(String(100), unique=True, index=True)
    cedula = Column(String(20), unique=True)
    telefono = Column(String(15))
    direccion = Column(String(150))
    password = Column(String(200))
    verificado = Column(Boolean, default=False)
    rol = Column(String(20), default="usuario")  # usuario | admin | mantenimiento
