from sqlalchemy.orm import Session, joinedload
from app.interfaces.I_usuario_repository import IUsuarioRepository 

# -------------------- IMPORTACIONES DE MODELOS ACTUALIZADAS --------------------
from app.models.Usuario import Usuario
from app.models.PerfilCliente import PerfilCliente
from app.models.Rol import Rol
# ---------------------------------------------------------------------------------

class UsuarioRepositoryDB(IUsuarioRepository):
    def __init__(self, db: Session):
        self.db = db
    
    def obtener_rol_id_por_nombre(self, nombre_rol: str) -> int:
        """Busca el ID del rol."""
        rol = self.db.query(Rol).filter(Rol.nombre == nombre_rol).first()
        if not rol:
            raise ValueError(f"El rol '{nombre_rol}' no existe. Debe precargarlo.")
        return rol.id

    def crear(self, datos_usuario: dict) -> Usuario:
        """Crea el Usuario y el PerfilCliente a partir de los datos recibidos (que ya incluyen rol_id)."""
        
        # 1. USUARIO 
        # Usamos el desempaquetado de diccionario (**) para mapear
        # automáticamente las claves del diccionario (nombre, correo, rol_id, etc.)
        # a las columnas del modelo Usuario.
        nuevo_usuario = Usuario(
            **datos_usuario
        )
        
        self.db.add(nuevo_usuario)
        # Flush para obtener el ID del usuario antes de crear el perfil
        self.db.flush() 

        # 2. PERFIL_CLIENTE 
        nuevo_perfil = PerfilCliente(
            usuario_id=nuevo_usuario.id,
            saldo_disponible=0.00,
            cant_viajes_acum=0
        )
        self.db.add(nuevo_perfil)
        
        self.db.commit()
        self.db.refresh(nuevo_usuario)
        return nuevo_usuario

    def obtener_por_correo(self, correo: str) -> Usuario | None:
        """Obtiene un usuario, cargando su rol y perfil de cliente."""
        return self.db.query(Usuario).options(
            joinedload(Usuario.rol_obj),
            joinedload(Usuario.perfil_cliente)
        ).filter(Usuario.correo == correo).first()
