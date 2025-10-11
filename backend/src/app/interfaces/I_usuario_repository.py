# app/interfaces/I_usuario_repository.py

from abc import ABC, abstractmethod
from typing import Optional

# ¡IMPORTACIÓN CIRCULAR REMOVIDA!

class IUsuarioRepository(ABC):
    """Contrato que define las operaciones de acceso a datos para el dominio de Usuario."""
    
    @abstractmethod
    def crear(self, data: object) -> object:
        """Define la creación de un Usuario/Cliente (Usuario y PerfilCliente)."""
        pass
        
    @abstractmethod
    def obtener_por_correo(self, correo: str) -> Optional[object]:
        """Define la búsqueda de un Usuario por correo electrónico."""
        pass