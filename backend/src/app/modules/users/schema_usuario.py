from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    telefono: str
    direccion: str

class UsuarioCreate(UsuarioBase):
    cedula: str
    password: str

class UsuarioOut(UsuarioBase):
    id: int
    verificado: bool
    rol: str

    model_config = {"from_attributes": True}
