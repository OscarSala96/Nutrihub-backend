# NutriHub Backend

API REST desarrollada con **NestJS y TypeScript** para una plataforma de gestión nutricional. NutriHub permite a los nutricionistas administrar sus pacientes, gestionar dietas y registrar su evolución, con acceso diferenciado según el tipo de usuario.

🔗 **API desplegada:** [nutrihub-backend.vercel.app](https://nutrihub-backend.vercel.app/)

## 🚀 Tecnologías

- **NestJS** — Framework para el desarrollo de la API REST.
- **TypeScript** — Tipado estático y desarrollo más mantenible.
- **Prisma ORM** — Acceso a datos y gestión del esquema de base de datos.
- **Supabase** — Base de datos PostgreSQL y autenticación de usuarios.
- **Node.js** — Entorno de ejecución.
- **Jest** — Pruebas automatizadas.

## ✨ Funcionalidades

### Autenticación y usuarios
- Registro e inicio de sesión mediante Supabase Auth.
- Validación de tokens de acceso Bearer.
- Identificación del usuario autenticado.
- Gestión de perfiles de nutricionistas y pacientes.

### Gestión de pacientes
- Creación de pacientes vinculados a un nutricionista.
- Consulta del listado de pacientes.
- Obtención, actualización y eliminación de perfiles.
- Creación de cuentas de usuario y sincronización de sus identificadores.

### Gestión de dietas
- Creación y consulta de dietas para cada paciente.
- Definición de fechas de inicio y finalización.
- Almacenamiento de la descripción de la dieta en formato JSON.
- Control de acceso para impedir que un nutricionista gestione pacientes ajenos.

### Seguimiento del progreso
- Registro y consulta de la evolución del paciente.
- Almacenamiento del peso, la fecha y las observaciones.
- Acceso del paciente únicamente a sus propios datos de seguimiento.

## 🏗️ Arquitectura y seguridad

La API utiliza una separación de responsabilidades basada en NestJS y Prisma para gestionar la lógica de negocio y el acceso a los datos.

La autenticación se delega en Supabase Auth, mientras que el backend valida los tokens recibidos y aplica controles de acceso según el usuario autenticado y la relación entre nutricionistas y pacientes.

Los endpoints específicos del paciente permiten consultar sus propios datos sin depender de identificadores proporcionados por otros usuarios.

## 📋 Requisitos previos

- Node.js 20 o superior.
- npm.
- Supabase
- Prisma.

## ⚙️ Instalación y configuración

**1. Clonar el repositorio**

```bash
git clone https://github.com/OscarSala96/Nutrihub-backend.git
cd Nutrihub-backend
```

**2. Instalar las dependencias**

```bash
npm install
```

**3. Configurar las variables de entorno**

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Configura las siguientes variables en el archivo `.env`:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a la base de datos mediante el pooler de Supabase. |
| `DIRECT_URL` | Conexión directa utilizada para las migraciones de Prisma. |
| `SUPABASE_URL` | URL del proyecto de Supabase. |
| `SUPABASE_ANON_KEY` | Clave pública de Supabase. |
| `PORT` | Puerto de ejecución de la API (por defecto, `3000`). |
| `CORS_ORIGINS` | Orígenes autorizados para las peticiones CORS. |

No subas credenciales ni secretos al repositorio.

**4. Generar el cliente de Prisma y aplicar las migraciones**

```bash
npx prisma generate
npx prisma migrate deploy
```

**5. Iniciar el servidor en desarrollo**

```bash
npm run start:dev
```

## 🔌 Endpoints principales

Todos los endpoints, excepto los de registro e inicio de sesión, requieren un token de acceso válido de Supabase.

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registrar un nutricionista. |
| `POST` | `/auth/login` | Iniciar sesión. |
| `POST` | `/auth/register-patient` | Registrar un paciente desde una cuenta de nutricionista. |
| `GET` | `/auth/me` | Obtener el usuario autenticado. |
| `POST` | `/patients` | Crear un paciente. |
| `GET` | `/patients` | Listar pacientes del nutricionista. |
| `GET` | `/patients/:id` | Obtener un paciente. |
| `PATCH` | `/patients/:id` | Actualizar un paciente. |
| `DELETE` | `/patients/:id` | Eliminar un paciente. |
| `POST` | `/patients/:patientId/diets` | Crear una dieta. |
| `GET` | `/patients/:patientId/diets` | Consultar dietas de un paciente. |
| `POST` | `/patients/:patientId/progress` | Registrar el progreso de un paciente. |
| `GET` | `/patients/:patientId/progress` | Consultar su progreso. |
| `GET` | `/patient/me` | Obtener el perfil del paciente autenticado. |
| `GET` | `/patient/me/diets` | Consultar las dietas del paciente autenticado. |
| `GET` | `/patient/me/progress` | Consultar su propio progreso. |
| `POST` | `/patient/me/progress` | Registrar el propio progreso. |

Las rutas de dietas y seguimiento están protegidas para limitar el acceso a los datos que corresponden al usuario autenticado.

## 🧪 Pruebas y compilación

Ejecuta las pruebas automatizadas:

```bash
npm test
```

Comprueba que el proyecto compila correctamente:

```bash
npm run build
```

## 📌 Estado del proyecto

NutriHub Backend es una API en desarrollo orientada a un MVP de gestión nutricional. Su objetivo es proporcionar una base para conectar una aplicación frontend con los servicios de autenticación, gestión de pacientes, dietas y seguimiento de la evolución.
