# app/modules/users/schemas/usuario_schema.py

from pydantic import BaseModel, EmailStr

# ----------------- INPUTS -----------------
class UsuarioCreate(BaseModel):
    nombre: str
    correo: EmailStr
    telefono: str
    direccion: str
    cedula: str
    password: str

class UsuarioLogin(BaseModel):
    correo: EmailStr
    password: str

# ----------------- OUTPUTS -----------------
class UsuarioOut(BaseModel):
    id: int
    nombre: str
    correo: EmailStr
    telefono: str
    direccion: str
    rol_nombre: str 
    verificado: bool
    
    saldo_disponible: float
    cant_viajes_acum: int 

    class Config:
        from_attributes = True