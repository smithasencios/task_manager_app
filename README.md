# Task Manager App (Angular)

Aplicación Angular con Firebase Auth y gestión de tareas, integrada con la API en `http://localhost:3000/api` (ver `api-docs`).

## Requisitos

- Node.js 20+
- Firebase (Auth Email/Password)
- API de tareas en `http://localhost:3000`

## Configuración rápida

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Firebase**  
   En [Firebase Console](https://console.firebase.google.com): crea proyecto, activa **Authentication → Email/Password**.  
   Edita `src/environments/environment.ts` y `environment.prod.ts` con tu `firebaseConfig`:
   ```ts
   firebase: {
     apiKey: '...',
     authDomain: '...',
     projectId: '...',
     storageBucket: '...',
     messagingSenderId: '...',
     appId: '...',
   },
   ```
   Opcional: cambia `apiBaseUrl` si la API usa otra URL.

3. **Build y ejecución**
   ```bash
   npm run build:prod    # build producción (optimizado)
   npm start            # servidor desarrollo en http://localhost:4200
   ```

4. **Tests**
   ```bash
   npm test
   ```

## Funcionalidad

- **Auth** (`/auth`): Sign up / Sign in. Si ya hay sesión → redirección al landing.
- **Landing** (`/`): Lista de tareas (orden por fecha de creación), formulario para añadir, logout. Por tarea: título, descripción, fecha, estado, checkbox completada/pendiente, editar, eliminar.
- **API**: Peticiones a `/api/tasks` con `Authorization: Bearer <Firebase ID token>`.

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm start` | `ng serve` (desarrollo) |
| `npm run build` | `ng build` (producción por defecto) |
| `npm run build:prod` | Build producción explícito |
| `npm test` | Tests unitarios |

## Verificar que todo funciona

En la raíz del proyecto:

```bash
npm install
npm run build:prod
npm start
```

Abre `http://localhost:4200`. Deberías ver la pantalla de login; tras iniciar sesión, el landing con las tareas. Asegúrate de que la API en `http://localhost:3000` esté en marcha.

## Troubleshooting

- **`ENOTCACHED` / `only-if-cached`**: Si `npm install` falla con este error, suele deberse a configuración de npm (p. ej. en CI). Prueba en una terminal normal, sin variables de entorno que fuercen caché. Puedes usar `npm install --prefer-online`.
- **Firebase**: Configura bien `environment.ts`; si no, la app no arrancará (error en `initializeApp`).
