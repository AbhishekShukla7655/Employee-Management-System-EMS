# Nexus EMS — Spring Boot Backend

Production-ready REST API for the Employee Management System.

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.3 |
| Security | Spring Security + JWT (JJWT 0.12) |
| Database | PostgreSQL + Spring Data JPA + Hibernate |
| Build | Maven |
| Image Storage | Cloudinary |
| Docs | SpringDoc OpenAPI (Swagger UI) |
| Utilities | Lombok, MapStruct |

## Project Structure

```
src/main/java/com/nexus/ems/
├── EmsApplication.java
├── config/
│   ├── ApplicationConfig.java      # Beans: UserDetailsService, AuthProvider, PasswordEncoder
│   ├── SecurityConfig.java         # JWT filter chain, CORS, route authorization
│   ├── CloudinaryConfig.java       # Cloudinary bean
│   └── OpenApiConfig.java          # Swagger/OpenAPI setup
├── controller/
│   ├── AuthController.java         # /api/auth/**
│   ├── EmployeeController.java     # /api/employees/**
│   ├── ManagerController.java      # /api/managers/**
│   ├── TaskController.java         # /api/tasks/**
│   ├── AttendanceController.java   # /api/attendance/**
│   ├── SalaryController.java       # /api/salary/**
│   ├── DashboardController.java    # /api/dashboard/**
│   └── UserController.java         # /api/users/** (Admin)
├── service/
│   ├── AuthService.java
│   ├── EmployeeService.java
│   ├── ManagerService.java
│   ├── TaskService.java
│   ├── AttendanceService.java
│   ├── SalaryService.java
│   ├── DashboardService.java
│   ├── UserService.java
│   ├── RefreshTokenService.java
│   └── CloudinaryService.java
├── repository/
│   ├── UserRepository.java
│   ├── EmployeeRepository.java
│   ├── RefreshTokenRepository.java
│   ├── TaskRepository.java
│   ├── AttendanceRepository.java
│   └── SalaryRepository.java
├── entity/
│   ├── User.java                   # Implements UserDetails
│   ├── Employee.java
│   ├── RefreshToken.java
│   ├── Task.java
│   ├── Attendance.java
│   ├── Salary.java
│   └── enums: Role, Gender, TaskStatus, TaskPriority, AttendanceStatus
├── dto/
│   ├── request/  AuthRequest, EmployeeRequest, TaskRequest, AttendanceRequest, SalaryRequest
│   └── response/ Response (all response DTOs as inner classes)
├── security/
│   ├── jwt/JwtService.java
│   └── filter/JwtAuthenticationFilter.java
└── exception/
    ├── ResourceNotFoundException.java
    ├── BadRequestException.java
    ├── TokenExpiredException.java
    └── handler/GlobalExceptionHandler.java
```

## Quick Start

### 1. Prerequisites
- Java 21
- Maven 3.9+
- PostgreSQL 15+
- Cloudinary account (free tier works)

### 2. Database Setup
```sql
-- Run as postgres superuser
CREATE DATABASE ems_db;
```
Then run `src/main/resources/schema.sql` against `ems_db` to create tables and seed data.

### 3. Configure application.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ems_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET

# Generate a 256-bit base64 key for production:
# openssl rand -base64 32
jwt.secret=YOUR_BASE64_SECRET
```

### 4. Run
```bash
mvn spring-boot:run
```

### 5. API Documentation
Visit: http://localhost:8080/swagger-ui.html

Click **Authorize** → enter `Bearer <your_token>` to test secured endpoints.

## API Endpoints Summary

### Authentication `/api/auth`
| Method | Path | Description |
|---|---|---|
| POST | `/login` | Login → returns accessToken + refreshToken |
| POST | `/register` | Register new user |
| POST | `/refresh-token` | Get new access token |
| POST | `/logout` | Invalidate refresh token |

### Employees `/api/employees`
| Method | Path | Role |
|---|---|---|
| GET | `/` | ADMIN, MANAGER |
| GET | `/{id}` | All |
| GET | `/profile` | Self |
| POST | `/` | ADMIN |
| PUT | `/{id}` | ADMIN |
| PUT | `/profile` | Self |
| DELETE | `/{id}` | ADMIN |
| POST | `/{id}/upload-image` | All |

### Tasks `/api/tasks`
| Method | Path | Description |
|---|---|---|
| GET | `/` | All tasks (Admin) |
| GET | `/my-tasks` | Tasks assigned to current user |
| GET | `/team` | Team tasks (Manager) |
| POST | `/` | Create/assign task |
| PUT | `/{id}` | Update task |
| PATCH | `/{id}/status` | Update status only |
| DELETE | `/{id}` | Delete task |

### Attendance `/api/attendance`
| Method | Path | Description |
|---|---|---|
| GET | `/` | All records (Admin) |
| GET | `/my` | My attendance history |
| GET | `/team` | Team attendance (Manager) |
| POST | `/` | Record attendance (Admin/Manager) |
| PUT | `/{id}` | Update record |
| POST | `/check-in` | Self check-in |
| POST | `/check-out` | Self check-out |

### Salary `/api/salary`
| Method | Path | Description |
|---|---|---|
| GET | `/` | All records (Admin) |
| GET | `/my` | My salary history |
| GET | `/summary` | Latest salary summary |
| POST | `/generate` | Generate salary (Admin) |

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@nexus.com | admin123 |
| Manager | manager@nexus.com | manager123 |
| Employee | employee@nexus.com | emp123 |

## Salary Formula

```
Net Salary = (Basic Salary ÷ 26) × Present Days + Bonus − Deductions
```

## JWT Configuration

- Access Token: 24 hours (`jwt.access-token-expiration=86400000`)
- Refresh Token: 7 days (`jwt.refresh-token-expiration=604800000`)
- Algorithm: HS256 with 256-bit secret key

## Cloudinary Setup

1. Sign up at https://cloudinary.com (free tier = 25GB storage)
2. Get Cloud Name, API Key, API Secret from the dashboard
3. Update `application.properties`
4. Images are stored in `ems/employees/` folder with 400×400 face-crop transformation

## Production Checklist

- [ ] Change `jwt.secret` to a strong random key (`openssl rand -base64 32`)
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (never `create-drop` in production)
- [ ] Configure `cors.allowed-origins` to your actual frontend domain
- [ ] Use environment variables or Spring Cloud Config for secrets
- [ ] Enable HTTPS / reverse proxy (nginx)
- [ ] Set up connection pooling (HikariCP defaults are fine for moderate load)
