# Proyecto Bike-Ride

Este proyecto está dividido en dos partes: **Backend (FastAPI)** y **Frontend (HTML estático con servidor local)**.

---

## 🚀 Instrucciones de ejecución

### 🖥️ FRONTEND
1. Abre una terminal y ejecuta:
   ```
   cd ...\Bike-Ride\frontend
   python -m http.server 3000
   ```
2. Luego entra al navegador en:
   ```
   http://localhost:3000/templates/index.html
   ```
---

### ⚙️ BACKEND
1. Abre otra terminal y ejecuta:
   ```
   cd ...\Bike-Ride\backend\src
   uvicorn app.main:app --reload
   ```
2. El backend estará disponible en:
   ```
   http://127.0.0.1:8000
   ```
---

## 🗄️ Configuración de Base de Datos

1. Crea una base de datos en **PostgreSQL** llamada `BikeRide`.

2. En el archivo:
   ```
   backend/src/app/repository/database.py
   ```
   actualiza la variable `DATABASE_URL` con tus credenciales.  
   Ejemplo:
   ```python
   DATABASE_URL = "postgresql://postgres:1234@localhost:5432/BikeRide"
   ```

3. Antes de ejecutar el backend por primera vez, asegúrate de tener creadas las tablas y agrega los roles con la siguiente consulta SQL:
   ```sql
   INSERT INTO roles (id, nombre) VALUES
   (1, 'ADMIN'),
   (2, 'EMPLEADO'),
   (3, 'USUARIO')
   ON CONFLICT (id) DO NOTHING;
   ```

---

## 🧩 Dependencias

Para instalar las dependencias necesarias:
```
pip install -r requirements.txt
```


---

Borrar los pycaches
## 🧠 Notas finales
- Asegúrate de tener **PostgreSQL** ejecutándose antes de iniciar el backend.
- Si cambias el puerto del servidor del front, actualiza las rutas `fetch` del JavaScript.

