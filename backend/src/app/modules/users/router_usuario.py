# app/modules/users/Router_usuario.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

# -------------------- IMPORTACIONES DE SCHEMAS ACTUALIZADAS --------------------
from app.modules.users.schemas.Usuario_schema import UsuarioCreate, UsuarioOut, UsuarioLogin
# -------------------- CLASE DE SERVICIO RENOMBRADA --------------------
from app.modules.users.service_usuario import ServiceUsuario 

from app.repository.repository_usuario_db import UsuarioRepositoryDB
from app.repository.database import get_db 

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# ----------------- Inyección de Dependencias -----------------
def obtener_auth_service(
    db: Session = Depends(get_db),
) -> ServiceUsuario:
    """Inyecta el servicio de autenticación con la implementación de DB."""
    # Aquí se instancia la implementación concreta
    repo = UsuarioRepositoryDB(db)
    return ServiceUsuario(repo) 

# ----------------- Endpoints API -----------------

@router.post(
    "/registro", 
    response_model=UsuarioOut, 
    status_code=status.HTTP_201_CREATED,
    summary="Registra un nuevo Ciudadano (Cliente)."
)
def registrar_usuario(
    data: UsuarioCreate, 
    service: ServiceUsuario = Depends(obtener_auth_service)
):
    """Registra al usuario y asigna el rol 'ciudadano' por defecto."""
    return service.registrar_usuario(data)

@router.post(
    "/login", 
    response_model=UsuarioOut, 
    summary="Permite el inicio de sesión."
)
def login_usuario(
    data: UsuarioLogin,
    service: ServiceUsuario = Depends(obtener_auth_service)
):
    """Verifica las credenciales y devuelve el perfil."""
    return service.login_usuario(data)