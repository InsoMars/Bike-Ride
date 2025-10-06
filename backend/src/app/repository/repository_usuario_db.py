from sqlalchemy.orm import Session
from app.interfaces.I_usuario_repository import IUsuarioRepository
from app.modules.users.model_usuario import Usuario
from app.modules.users.schema_usuario import UsuarioCreate, UsuarioOut

class UsuarioRepositoryDB(IUsuarioRepository):
    def __init__(self, db: Session):
        self.db = db

    def crear(self, data: UsuarioCreate) -> UsuarioOut:
        nuevo = Usuario(
            nombre=data.nombre,
            correo=data.correo,
            telefono=data.telefono,
            direccion=data.direccion,
            cedula=data.cedula,
            password=data.password
        )
        self.db.add(nuevo)
        self.db.commit()
        self.db.refresh(nuevo)
        return UsuarioOut.from_orm(nuevo)

    def obtener_por_correo(self, correo: str):
        return self.db.query(Usuario).filter(Usuario.correo == correo).first()
