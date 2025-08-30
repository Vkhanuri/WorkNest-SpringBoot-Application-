# WorkNest-a-SpringBoot-Application

A comprehensive task management system built with Spring Boot, H2 Database/MySql Database, and Thymeleaf.

## Features

### Admin Functionality:
- User management (Add, view, delete users)
- Task allocation with start and due dates
- Dashboard with task statistics (Pending, In Progress, Completed, Delayed)
- View all comments from users
- Task status tracking

### User Functionality:
- View assigned tasks
- Update task status (In Progress, Completed)
- Add comments on tasks
- Personal dashboard with statistics
- Filter tasks by status

## Technology Stack

- **Backend**: Spring Boot 3.2.0, Spring Security, Spring Data JPA
- **Database**: H2 (in-memory)/MySql 
- **Frontend**: Thymeleaf, Bootstrap 5, HTML/CSS/JavaScript
- **Security**: BCrypt password encoding, role-based access control
- **Build Tool**: Maven

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+ (or use IDE's built-in Maven)
- Eclipse IDE (recommended) or any Java IDE

### Running in Eclipse

1. **Import the project:**
   - File → Import → Existing Maven Projects
   - Select the `SpringBootWorkNest` folder
   - Click Finish

2. **Run the application:**
   - Right-click on `SpringBootWorkNestApplication.java`
   - Select "Run As" → "Spring Boot App"
   - Or run `main()` method in `SpringBootWorkNestApplication.java`

3. **Access the application:**
   - Open browser and go to `http://localhost:8080`
   - H2 Console (optional): `http://localhost:8080/h2-console`
     - JDBC URL: `jdbc:h2:mem:worknest`
     - Username: `sa`
     - Password: (empty)

4. **Configuration for Database**
   ## H2 Database Configuration
   - spring.datasource.url=jdbc:h2:mem:worknest
   - spring.datasource.driverClassName=org.h2.Driver
   - spring.datasource.username=sa
   - spring.datasource.password=
   - spring.h2.console.enabled=true
   - spring.h2.console.path=/h2-console

   ## MySql Database Configuration
   - spring.datasource.url=jdbc:mysql://localhost:3306/worknestappdb?useSSL=false&serverTimezone=UTC
   - spring.datasource.username=root
   - spring.datasource.password=root
   - spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver


### Default Users

The application comes with pre-loaded sample data:

**Admin User:**
- Email: `admin@worknest.com`
- Password: `admin123`

**Sample Users:**
- Email: `veena@gmail.com` / Password: `password123`
- Email: `praveen@gmail.com` / Password: `password123`

## Project Structure

```
WORKNESTAPPLICATION-using-SPRINGBOOT/
└── WORKNESTAPPLICATION/
    └── SpringBootWorkNest/
        ├── src/main/java/com/worknest/
        │   ├── SpringBootWorkNestApplication.java
        │   ├── config/
        │   │   └── DataLoader.java
        │   ├── controller/
        │   │   ├── HomeController.java
        │   │   ├── AdminController.java
        │   │   └── UserController.java
        │   ├── model/
        │   │   ├── User.java
        │   │   ├── Task.java
        │   │   └── Comment.java
        │   ├── repository/
        │   │   ├── UserRepository.java
        │   │   ├── TaskRepository.java
        │   │   └── CommentRepository.java
        │   ├── security/
        │   │   ├── SecurityConfig.java
        │   │   └── AppConfig.java
        │   └── service/
        │       ├── UserService.java
        │       ├── TaskService.java
        │       └── CommentService.java
        ├── src/main/resources/
        │   ├── application.properties
        │   ├── static/css/
        │   │   └── custom.css
        │   └── templates/
        │       ├── index.html
        │       ├── login.html
        │       ├── register.html
        │       ├── admin/
        │       │   ├── dashboard.html
        │       │   ├── users.html
        │       │   ├── tasks.html
        │       │   └── comments.html
        │       └── user/
        │           ├── dashboard.html
        │           ├── tasks.html
        │           └── task-detail.html
        └── pom.xml
```

## Key Features Implementation

1. **Authentication & Authorization**: Spring Security with role-based access
2. **Database**: H2 in-memory/Mysql database with JPA/Hibernate
3. **Models**: User, Task, Comment entities with proper relationships
4. **Services**: Business logic layer for all operations
5. **Controllers**: Separate admin and user controllers
6. **Frontend**: Thymeleaf templates with Bootstrap styling

## Database Schema

- **Users**: id, name, email, password, role, created_at
- **Tasks**: id, title, description, assigned_user_id, status, start_date, due_date, created_at, updated_at
- **Comments**: id, task_id, user_id, comment_text, created_at

## Maven Dependencies

- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Thymeleaf
- H2 Database/MySql
- JWT (JSON Web Token) for future API enhancements

## Running via Command Line

```bash
# Navigate to project directory
cd SpringBootWorkNest

# Run with Maven
./mvnw spring-boot:run

# Or build and run JAR
./mvnw clean package
java -jar target/SpringBootWorkNest-0.0.1-SNAPSHOT.jar
```

The application will start on port 8080.




    
