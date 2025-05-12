# Sistema de Registro con Base de Datos

Este es un sistema simple de CRUD (Crear, Leer, Actualizar, Eliminar) para gestionar registros de usuarios utilizando JavaScript, Node.js, Express y almacenamiento JSON.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **Frontend**: Interfaz de usuario desarrollada con HTML, CSS y JavaScript.
- **Backend**: API REST desarrollada con Node.js y Express, que gestiona los datos y los almacena en un archivo JSON.

## Requisitos Previos

Para ejecutar este proyecto necesitarás tener instalado:

- [Node.js](https://nodejs.org/) (v14 o superior)
- npm (viene incluido con Node.js)

## Cómo Iniciar el Proyecto

### 1. Instalar las dependencias del backend

Desde la terminal, navega hasta la carpeta del backend e instala las dependencias:

```bash
cd "Registro con base de datos/backend"
npm install
```

### 2. Iniciar el servidor

Mientras estás en la carpeta del backend, ejecuta:

```bash
npm start
```

O si quieres ejecutarlo en modo desarrollo con recarga automática:

```bash
npm run dev
```

### 3. Acceder a la aplicación

Una vez que el servidor esté en funcionamiento, puedes acceder a la aplicación a través de:

- Directamente en el navegador: http://localhost:3000
- A través del iframe en la página principal del proyecto

## Funcionalidades

- Crear nuevos registros con nombre, email, teléfono y fecha
- Ver todos los registros almacenados
- Buscar registros por nombre, email o teléfono
- Editar registros existentes
- Eliminar registros

## Arquitectura

- **Frontend**:
  - HTML semántico para la estructura
  - CSS para los estilos y diseño responsivo
  - JavaScript para la interactividad y consumo de la API

- **Backend**:
  - Express para el servidor HTTP y la API REST
  - Almacenamiento en archivos JSON para simular una base de datos
  - Middleware CORS para permitir peticiones desde el frontend

## Notas

- Este proyecto es con fines educativos y no utiliza una base de datos real, sino que simula una mediante archivos JSON.
- Los datos se guardan localmente en el servidor en el archivo `registros.json`.
- Para un entorno de producción, se recomienda implementar una base de datos real como MongoDB, MySQL u otra. 