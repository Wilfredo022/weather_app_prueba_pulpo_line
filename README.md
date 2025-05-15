# Aplicación del Clima con React y Nest.js

Este repositorio contiene el código fuente para una aplicación web del clima construida con un frontend en React y un backend en Nest.js.

## Tecnologías Utilizadas

**Frontend (./frontend):**

- [React](https://react.dev/): Biblioteca para construir interfaces de usuario.
- [React Router DOM](https://reactrouter.com/): Enrutamiento declarativo para React.
- [Axios](https://axios-http.com/): Cliente HTTP basado en promesas para realizar peticiones al backend.
- [React Hook Form](https://react-hook-form.com/): Librería para la gestión de formularios en React con validación.
- [i18next](https://www.i18next.com/): Framework de internacionalización para JavaScript (soporte para español e inglés).
- [Zod](https://zod.dev/): Biblioteca de TypeScript para la validación de esquemas.
- [Zustand](https://zustand-drehmoment.vercel.app/): Librería minimalista de gestión de estado para React.
- [Jest](https://jestjs.io/): Framework de testing de JavaScript.
- [Testing Library](https://testing-library.com/): Utilidades para probar componentes de React enfocándose en el comportamiento del usuario.
- [Progressive Web App (PWA)](https://web.dev/progressive-web-apps/): Funcionalidades para instalar y usar la aplicación como una aplicación nativa.

**Backend (./backend):**

- [NestJS](https://nestjs.com/): Framework progresivo de Node.js para construir aplicaciones de servidor eficientes y escalables.
- [Prisma](https://www.prisma.io/): ORM de próxima generación para Node.js y TypeScript.
- [PostgreSQL](https://www.postgresql.org/): Sistema de gestión de bases de datos relacional.
- [Passport](http://www.passportjs.org/): Middleware de autenticación para Node.js.
- [Passport-JWT](https://github.com/mikenicholson/passport-jwt): Estrategia de Passport para autenticación con JSON Web Tokens.
- [Jest](https://jestjs.io/): Framework de testing de JavaScript.

## Instrucciones de Instalación

Puedes instalar y ejecutar la aplicación de dos maneras: directamente en tu máquina o utilizando Docker.

### Sin Docker

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_REPOSITORIO>
    ```

2.  **Configurar las variables de entorno:**

    - **Backend:** Crea un archivo `.env` en el directorio `backend` y configura las variables necesarias (por ejemplo, la URL de la base de datos de PostgreSQL, secretos para JWT, etc.). Puedes tomar como ejemplo el archivo `.env.example` si existe.
    - **Frontend:** Crea un archivo `.env` en el directorio `frontend` y configura las variables necesarias (por ejemplo, la URL del backend).

3.  **Instalar las dependencias:**

    ```bash
    cd backend
    npm install  # o yarn install
    cd ../frontend
    npm install  # o yarn install
    cd ..
    ```

4.  **Configurar la base de datos (Backend):**

    ```bash
    cd backend
    npx prisma migrate dev --name init
    npx prisma generate
    cd ..
    ```

5.  **Ejecutar las aplicaciones:**

    ```bash
    # Abre una terminal para el backend
    cd backend
    npm run start:dev # o yarn start:dev

    # Abre otra terminal para el frontend
    cd frontend
    npm run dev # o yarn dev
    ```

    El frontend estará disponible en `http://localhost:5173` (por defecto en React.js vite) y el backend en `http://localhost:3050`.

### Con Docker

Asegúrate de tener [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) instalados en tu sistema.

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_REPOSITORIO>
    ```

2.  **Configurar las variables de entorno:**

    - **Backend:** Asegúrate de tener un archivo `.env` en el directorio `backend` con las configuraciones necesarias.
    - **Frontend:** Asegúrate de tener un archivo `.env` en el directorio `frontend` con las configuraciones necesarias.

3.  **Ejecutar con Docker Compose:**

    ```bash
    docker-compose up -d --build
    ```

    Esto construirá las imágenes y levantará los contenedores del backend y el frontend. El frontend estará accesible en `http://localhost:80` y el backend en `http://localhost:3050`.

4.  **Ejecutar las migraciones de Prisma (si es necesario):**
    Puedes ejecutar las migraciones de Prisma dentro del contenedor del backend:
    ```bash
    docker-compose exec backend npx prisma migrate dev --name init
    docker-compose exec backend npx prisma generate
    ```

## Cómo Funciona la App

La aplicación está estructurada en dos partes principales: el frontend y el backend.

### Frontend (React)

El frontend, ubicado en la carpeta `./frontend`, es una aplicación de React que proporciona la interfaz de usuario para interactuar con los datos del clima y la gestión de favoritos.

- **Estructura de Carpetas (ejemplo):**

  ```
  frontend/
  ├── public/
  ├── src/
  │   ├── assets/
  │   ├── components/
  │   ├── hooks/
  │   ├── interface/
  │   ├── locales/
  │   ├── pages/
  │   ├── services/     # Lógica para las peticiones al backend (Axios)
  │   ├── stores/        # Manejo del estado global (Zustand)
  │   ├── i18n         # Configuración de internacionalización (i18next)
  │   ├── App.js        # Componente principal
  │   └── index.js
  ├── ...
  ├── package.json
  └── ...
  ```

- **Decisiones de Diseño:**

  - **Gestión de Estado (Zustand):** Se eligió Zustand por su simplicidad y rendimiento para manejar el estado global de la aplicación, como la información del usuario, la lista de favoritos y posiblemente el estado de la búsqueda del clima.
  - **Peticiones HTTP (Axios):** Axios se utiliza para realizar peticiones asíncronas al backend, facilitando la obtención de datos del clima y la manipulación de favoritos.
  - **Formularios (React Hook Form):** React Hook Form se utiliza para la gestión eficiente y la validación de formularios, como el formulario de búsqueda de ciudades. Zod se integra para la definición de esquemas de validación robustos.
  - **Internacionalización (i18next):** i18next permite ofrecer la aplicación en múltiples idiomas (español e inglés), mejorando la experiencia del usuario.
  - **Pruebas (Jest y Testing Library):** Se implementaron pruebas unitarias e de integración utilizando Jest y Testing Library para asegurar la calidad y el correcto funcionamiento de los componentes y la lógica del frontend.
  - **PWA:** La aplicación está configurada como una PWA, lo que permite a los usuarios instalarla en sus dispositivos, recibir notificaciones push (si se implementan) y acceder a ciertas funcionalidades sin conexión.
  - **Enrutamiento (React Router DOM):** React Router DOM se utiliza para la navegación entre diferentes vistas de la aplicación (por ejemplo, la página de búsqueda del clima y la página de favoritos).

- **Manejo de Errores:**
  - Se implementan mecanismos para capturar y mostrar errores de las peticiones al backend (por ejemplo, ciudades no encontradas, errores de conexión).
  - La validación de formularios con Zod ayuda a prevenir errores en la entrada de datos del usuario.
  - Posiblemente se implementen componentes o lógicas específicas para mostrar mensajes de error amigables al usuario.

### Backend (NestJS)

El backend, ubicado en la carpeta `./backend`, es una aplicación construida con NestJS, un framework progresivo de Node.js. Proporciona las APIs necesarias para obtener datos del clima, autocompletar ciudades y gestionar la lista de favoritos.

- **Estructura de Carpetas (ejemplo):**

````
   backend/
   ├── src/
   │   ├── config/        # Archivos de configuración de la aplicación
   │   ├── modules/
   │   │   ├── auth/          # Módulo de autenticación (controladores, servicios, etc.)
   │   │   ├── autocomplete/  # Módulo para la funcionalidad de autocompletado de ciudades
   │   │   ├── favorites/     # Módulo para la gestión de la lista de favoritos
   │   │   └── weather/       # Módulo para la obtención de datos del clima
   │   ├── persistence/
   │   │   └── prisma/        # Cliente de Prisma generado
   │   ├── main.ts        # Punto de entrada de la aplicación
   │   ├── app.module.ts  # Módulo principal de la aplicación
   │   └── ...
   ├── .env             # Variables de entorno
   ├── package.json
   ├── nest-cli.json    # Configuración de Nest CLI
   └── tsconfig.json
   ```


- **Decisiones de Diseño:**

 - **Arquitectura Modular (NestJS):** NestJS utiliza una arquitectura modular que ayuda a organizar el código de manera lógica y escalable. Los controladores manejan las peticiones HTTP, los servicios contienen la lógica de negocio, y los módulos agrupan funcionalidades relacionadas.
 - **ORM (Prisma):** Prisma se utiliza para interactuar con la base de datos PostgreSQL, proporcionando una forma segura y tipada de realizar consultas y mutaciones.
 - **Autenticación (Passport y Passport-JWT):** Passport y la estrategia Passport-JWT se utilizan para implementar la autenticación de usuarios, protegiendo las rutas que requieren acceso (como la gestión de favoritos). Esto probablemente se implementa a través de Guards y Strategies en NestJS.
 - **Pruebas (Jest):** Se implementan pruebas unitarias e de integración con Jest para asegurar la robustez y el correcto funcionamiento de la lógica del backend.

- **Manejo de Errores:**
 - NestJS proporciona mecanismos para manejar excepciones y enviar respuestas HTTP con códigos de estado apropiados. Se implementan filtros de excepción para personalizar la respuesta en caso de errores de la base de datos, errores de validación de las peticiones y errores al obtener datos de fuentes externas.

## Descripción de Endpoints del Backend

El backend expone los siguientes endpoints:

- **`GET /weather`**: Devuelve datos del clima para una ciudad o coordenadas específicas.

 - **Query Parameters:**
   - `city` (requerido): Nombre de la ciudad para buscar el clima.
   - `lang` (opcional): Código del idioma para la internacionalización de los datos del clima (ej: `es`, `en`).
   - `lat` (opcional): Latitud de la ubicación para buscar el clima.
   - `lon` (opcional): Longitud de la ubicación para buscar el clima.
 - **Ejemplo de uso:**
   - `GET /weather?city=Valencia&lang=es`
   - `GET /weather?city=Valencia&lat=40.7128&lon=-74.0060`

- **`GET /autocomplete`**: Devuelve sugerencias de ciudades basadas en una consulta.

 - **Query Parameters:**
   - `query` (requerido): Término de búsqueda para las sugerencias de ciudades.
 - **Ejemplo de uso:**
   - `GET /autocomplete?query=Val`

- **`GET /favorites`**: Obtiene la lista de ciudades favoritas del usuario autenticado.

 - **Autenticación:** Requiere autenticación mediante JWT.
 - **Respuesta:** Devuelve un array de nombres de ciudades favoritas.

- **`POST /favorites`**: Agrega una ciudad a la lista de favoritos del usuario autenticado.

 - **Autenticación:** Requiere autenticación mediante JWT.
 - **Cuerpo de la petición (ejemplo en JSON):**
   ```json
   {
     "city": "Nueva York"
   }
   ```

- **`DELETE /favorites/:city`**: Elimina una ciudad específica de la lista de favoritos del usuario autenticado.
 - **Autenticación:** Requiere autenticación mediante JWT.
 - **Parámetro de la ruta:**
   - `city` (requerido): Nombre de la ciudad a eliminar de los favoritos.
 - **Ejemplo de uso:**
   - `DELETE /favorites/Londres`
````
