from abc import ABC, abstractmethod
from app.modules.users.schema_usuario import UsuarioCreate, UsuarioOut

class IUsuarioRepository(ABC):
    @abstractmethod
    def crear(self, data: UsuarioCreate) -> UsuarioOut:
        pass

    @abstractmethod
    def obtener_por_correo(self, correo: str) -> UsuarioOut | None:
        pass
