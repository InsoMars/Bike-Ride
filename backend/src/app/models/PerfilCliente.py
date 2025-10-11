
from sqlalchemy import Column, Integer, DECIMAL, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.repository.database import Base 

class PerfilCliente(Base):
    __tablename__ = "perfiles_cliente"
    
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)
    
    saldo_disponible = Column(DECIMAL(10, 2), default=0.00)
    tiene_suscripcion = Column(Boolean, default=False)
    tiene_multas = Column(Boolean, default=False)
    cant_viajes_acum = Column(Integer, default=0) 
    
    usuario = relationship("Usuario", back_populates="perfil_cliente")