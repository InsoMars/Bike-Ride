from fastapi import APIRouter, Depends
from app.modules.users.schema_usuario import UsuarioCreate, UsuarioOut
from app.modules.users.service_usuario import AuthService
from app.repository.repository_usuario_db import UsuarioRepositoryDB
from app.repository.database import get_db

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(data: UsuarioCreate, db=Depends(get_db)):
    repo = UsuarioRepositoryDB(db)
    service = AuthService(repo)
    return service.registrar_usuario(data)
