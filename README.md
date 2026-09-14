# Nutrihub backend

MVP API NestJS + Prisma para nutricionistas. La autenticación la gestiona
Supabase Auth; el backend valida cada `Bearer` token con
`supabase.auth.getUser()` y vincula el usuario con `NUTRICIONISTA.auth_user_id`.

## Configuración

Copia `.env.example` a `.env` y completa los valores en el entorno de
desarrollo/producción. No guardes secretos en el repositorio.

- `DATABASE_URL`: pooler de Supabase en modo transacción.
- `DIRECT_URL`: conexión de sesión para migraciones Prisma.
- `SUPABASE_URL`: URL del proyecto Supabase.
- `SUPABASE_ANON_KEY`: clave pública/anon de Supabase (no usar la service-role
  key en el backend).
- `PORT` (opcional, por defecto `3000`).
- `CORS_ORIGINS` (opcional, lista separada por comas; `*` por defecto).

Node.js 20 necesita la dependencia `ws` para que el cliente de Supabase pueda
inicializar su transporte WebSocket; el backend ya la configura
explícitamente. Node.js 22 o superior incluye WebSocket nativo.

Instala dependencias, genera el cliente y aplica migraciones:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

## Endpoints MVP

Todos los endpoints salvo registro/login requieren
`Authorization: Bearer <access_token>` de Supabase.

- `POST /auth/register` — `{ email, password, nombre? }`.
- `POST /auth/login` — `{ email, password }`.
- `POST /auth/register-patient` — nutricionista autenticado; `{ patientId, email, password, nombre }`.
- `GET /auth/me`.
- `POST /patients` — crea la cuenta Supabase del paciente y el perfil con el
  mismo UUID (`{ nombre, email, password, pesoInicial, edad?, telefono? }`).
  `GET /patients`, `GET/PATCH/DELETE /patients/:id`.
- `POST/GET /patients/:patientId/diets`.
- `POST/GET /patients/:patientId/progress`.
- `GET /patient/me` — perfil del paciente autenticado.
- `GET /patient/me/diets`.
- `GET/POST /patient/me/progress`.

Dietas requieren `fechaInicio`, `fechaFin` ISO y `descripcion` JSON. Los
registros de progreso requieren `peso` y aceptan `fecha` ISO y
`observaciones` JSON. Las rutas parametrizadas de dietas y progreso solo se
pueden consultar o crear para pacientes pertenecientes al nutricionista
autenticado; las rutas `/patient/me/*` están limitadas al propio paciente.

## Validación

```bash
npm test
npm run build
```
