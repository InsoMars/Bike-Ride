from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Routers
from app.modules.users.router_usuario import router as usuario_router

# Base de datos
from app.repository.database import Base, engine

# Crear instancia de FastAPI
app = FastAPI(title="Sistema de Bicicletas - Registro de Usuarios", debug=True)

# Incluir routers
app.include_router(usuario_router)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # puedes restringir luego
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)
