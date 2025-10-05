# NestJS GraphQL AnyList

> Sistema de gestión de listas personalizable con NestJS, GraphQL y autenticación JWT

## 🚀 Características

- **API GraphQL** completa con consultas y mutaciones
- **Autenticación JWT** con sistema de roles (Admin/Guest)
- **Gestión de elementos** con inventario y unidades
- **Listas personalizables** con elementos y cantidades
- **Arquitectura hexagonal** con CQRS
- **Base de datos PostgreSQL** con TypeORM

## 📁 Arquitectura

```
src/modules/
├── auth/         # Autenticación (sign-up, sign-in, JWT)
├── users/        # Gestión de usuarios y roles
├── items/        # CRUD de elementos con inventario
├── lists/        # Listas con elementos y cantidades
└── shared/       # Utilidades, excepciones, paginación
```

Cada módulo implementa **Clean Architecture**:

- `application/`: DTOs, casos de uso (comandos/consultas)
- `domain/`: Entidades, repositorios, excepciones
- `infrastructure/`: Implementaciones (HTTP, base de datos)

## 🛠️ Instalación

```bash
# Clonar repositorio
git clone https://github.com/Joletuar/nest-graphql-anylist.git
cd nest-graphql-anylist

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar base de datos
docker-compose up -d

# Ejecutar migraciones
pnpm run migration:run
```

## 🚦 Comandos

```bash
# Desarrollo
pnpm run start:dev

# Producción
pnpm run start:prod

# Base de datos
pnpm run migration:generate <nombre>
pnpm run migration:run
pnpm run seed:run

# Pruebas
pnpm run test
pnpm run test:e2e
```

## � Funcionalidades

### Usuarios y Autenticación

- Registro e inicio de sesión con validación
- Roles: `ADMIN` y `GUEST` con permisos diferenciados
- Tokens JWT con expiración configurable

### Gestión de Items

- CRUD completo con validaciones
- Control de stock e inventario
- Búsqueda avanzada con filtros y paginación
- Unidades de medida personalizables

### Sistema de Listas

- Creación de listas personalizadas
- Asignación de items con cantidades específicas
- Gestión colaborativa por usuario

## 🔧 Configuración

### Variables de Entorno

```env
# Base de datos
TYPE_ORM_HOST=localhost
TYPE_ORM_PORT=5432
TYPE_ORM_USERNAME=postgres
TYPE_ORM_PASSWORD=postgres
TYPE_ORM_DATABASE=anylist_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### GraphQL Playground

Una vez iniciado el servidor, accede a:

- **Desarrollo**: `http://localhost:3000/graphql`
- Explorar schema, ejecutar queries y mutations

## �🛡️ Stack Tecnológico

| Categoría         | Tecnologías                 |
| ----------------- | --------------------------- |
| **Backend**       | NestJS, TypeScript, GraphQL |
| **Base de datos** | PostgreSQL, TypeORM         |
| **Autenticación** | JWT, Passport, Bcrypt       |
| **Arquitectura**  | CQRS, Clean Architecture    |
| **Desarrollo**    | Docker, ESLint, Prettier    |

## 📚 API Examples

### Crear Usuario

```graphql
mutation {
  CreateUser(
    input: {
      fullName: "Juan Pérez"
      email: "juan@example.com"
      password: "123456"
      roles: [GUEST]
      isActive: true
    }
  ) {
    id
    fullName
    email
  }
}
```

### Buscar Items

```graphql
query {
  SearchItems(
    criteria: {
      filters: [{ field: "name", value: "laptop", operator: CONTAINS }]
      pagination: { page: 1, perPage: 10 }
    }
  ) {
    items {
      id
      name
      stock
    }
    pagination {
      total
      page
    }
  }
}
```
