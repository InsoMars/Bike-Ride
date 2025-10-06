from app.interfaces.I_usuario_repository import IUsuarioRepository
from app.modules.users.schema_usuario import UsuarioCreate
from fastapi import HTTPException, status

class AuthService:
    def __init__(self, repo: IUsuarioRepository):
        self.repo = repo

    def registrar_usuario(self, data: UsuarioCreate):
        if self.repo.obtener_por_correo(data.correo):
            raise HTTPException(status_code=400, detail="Correo ya registrado")
        return self.repo.crear(data)
