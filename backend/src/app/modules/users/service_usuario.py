# app/modules/users/ServiceUsuario.py

# -------------------- IMPORTACIONES DE SCHEMAS ACTUALIZADAS --------------------
from app.modules.users.schemas.Usuario_schema import UsuarioCreate, UsuarioOut, UsuarioLogin

# --------------------------------------------------------------------------------

from app.interfaces.I_usuario_repository import IUsuarioRepository 
from app.models.Usuario import Usuario # Modelo ORM
from fastapi import HTTPException, status


class ServiceUsuario:
    def __init__(self, repo: IUsuarioRepository):
        self.repo = repo

    def registrar_usuario(self, data: UsuarioCreate) -> UsuarioOut:
        # 1. Validación de unicidad
        if self.repo.obtener_por_correo(data.correo):
            raise HTTPException(status_code=400, detail="Correo ya registrado.")
            
        # 2. Preparar los datos para la BD
        
        # Asignación del Rol 'USUARIO' (ID 3)
        ROL_USUARIO_ID = 3 
        
        # Convertir Pydantic a un diccionario mutable
        usuario_a_crear = data.model_dump() 
        
        # Inyectar el ID del rol para el usuario estándar
        usuario_a_crear['rol_id'] = ROL_USUARIO_ID 
        
        # 3. Creación. El repositorio recibe el diccionario modificado.
        # La contraseña se crea en texto plano, igual que viene del frontend.
        nuevo_usuario_orm = self.repo.crear(usuario_a_crear) 
        
        return self._map_to_usuario_out(nuevo_usuario_orm)
    
    def login_usuario(self, data: UsuarioLogin) -> UsuarioOut:
        usuario_orm = self.repo.obtener_por_correo(data.correo)
        
        # 1. Verificar credenciales (en texto plano)
        if not usuario_orm or usuario_orm.password != data.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Credenciales inválidas"
            )
        
        return self._map_to_usuario_out(usuario_orm)

    def _map_to_usuario_out(self, usuario_orm: Usuario) -> UsuarioOut:
        """Helper para mapear ORM a Output, manejando el rol y el perfil."""
        
        perfil = usuario_orm.perfil_cliente
        
        usuario_out_data = {
            "id": usuario_orm.id,
            "nombre": usuario_orm.nombre,
            "correo": usuario_orm.correo,
            "telefono": usuario_orm.telefono,
            "direccion": usuario_orm.direccion,
            
            "rol_nombre": usuario_orm.rol_obj.nombre if usuario_orm.rol_obj else "Desconocido",
            "verificado": usuario_orm.verificado,
            
            "saldo_disponible": float(perfil.saldo_disponible) if perfil else 0.00,
            "cant_viajes_acum": perfil.cant_viajes_acum if perfil else 0,
        }
        
        return UsuarioOut(**usuario_out_data)