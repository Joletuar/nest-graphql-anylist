# NestJS GraphQL Anylist

## Descripción

Este proyecto es una aplicación backend desarrollada con **NestJS** y **GraphQL**, diseñada para gestionar listas de elementos personalizables (AnyList). Permite a los usuarios crear, actualizar y consultar elementos en listas, con autenticación de usuarios y un sistema de roles.

El proyecto sigue una arquitectura modular y limpia, utilizando Command Query Responsibility Segregation (CQRS) y TypeORM para la persistencia de datos.

**Estado del proyecto:** Este proyecto está actualmente en proceso de desarrollo y no está terminado. Algunas funcionalidades pueden estar incompletas o sujetas a cambios.

## Características

- **Autenticación y Autorización:** Sistema de registro e inicio de sesión con JWT.
- **Gestión de Usuarios:** CRUD de usuarios con roles (ej. admin, user).
- **Gestión de Elementos:** Crear, actualizar, consultar y eliminar elementos en listas.
- **GraphQL API:** Esquema GraphQL para consultas y mutaciones.
- **Persistencia:** Base de datos con TypeORM (configurada para PostgreSQL u otros).
- **Arquitectura Modular:** Separación en capas (application, domain, infrastructure).
- **CQRS:** Separación de comandos y consultas para mejor escalabilidad.

## Estructura del Proyecto

El proyecto está organizado en módulos principales:

- **Auth:** Manejo de autenticación (sign-in, sign-up), hashing de contraseñas y tokens JWT.
- **Items:** Gestión de elementos (CRUD con comandos y consultas).
- **Users:** Gestión de usuarios (CRUD, búsqueda por criterios).
- **Shared:** Utilidades compartidas como excepciones, criterios de búsqueda, paginación, etc.

Cada módulo sigue la estructura:

- `application/`: DTOs, mappers, comandos y consultas.
- `domain/`: Entidades, repositorios, excepciones de dominio.
- `infrastructure/`: Implementaciones concretas (HTTP con NestJS, persistencia con TypeORM).

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Joletuar/nest-graphql-anylist.git
   cd nest-graphql-anylist
   ```

2. Instala las dependencias:

   ```bash
   pnpm install
   ```

3. Configura la base de datos (ej. PostgreSQL) en el archivo de configuración.

## Ejecución

```bash
# Modo desarrollo
pnpm run start:dev

# Producción
pnpm run start:prod
```

## Pruebas

```bash
# Pruebas unitarias
pnpm run test

# Pruebas e2e
pnpm run test:e2e

# Cobertura
pnpm run test:cov
```

## Tecnologías Utilizadas

- **NestJS:** Framework para Node.js.
- **GraphQL:** Para la API.
- **TypeORM:** ORM para bases de datos.
- **JWT:** Para autenticación.
- **TypeScript:** Lenguaje principal.
- **Docker:** Para contenedorización (ver docker-compose.yaml).
