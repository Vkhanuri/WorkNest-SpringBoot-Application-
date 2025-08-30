package com.worknest.config;

import com.worknest.model.User;
import com.worknest.model.Task;
import com.worknest.service.UserService;
import com.worknest.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private TaskService taskService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Default admin user if not exists
        if (!userService.existsByEmail("admin@worknest.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@worknest.com");
            admin.setPassword("admin123");
            admin.setRole(User.Role.ADMIN);
            userService.createUser(admin);
            
            System.out.println("Default admin user created: admin@worknest.com / admin123");
        }
        if (!userService.existsByEmail("adarsh@gmail.com")) {
            User user1 = new User();
            user1.setName("Naina");
            user1.setEmail("Naina@gmail.com");
            user1.setPassword(passwordEncoder.encode("password123"));
            user1.setRole(User.Role.USER);
            User savedUser1 = userService.createUser(user1);

            User user2 = new User();
            user2.setName("Vinayak");
            user2.setEmail("vinay@gmail.com");
            user2.setPassword(passwordEncoder.encode("password123"));
            user2.setRole(User.Role.USER);
            User savedUser2 = userService.createUser(user2);

//            //Only uncomment if you want to create sample tasks
//            Task task1 = new Task();
//            task1.setTitle("Complete Project Documentation");
//            task1.setDescription("Write comprehensive documentation for the WorkNest project including user manual and technical specifications.");
//            task1.setAssignedUser(savedUser1);
//            task1.setStartDate(LocalDate.now().minusDays(5));
//            task1.setDueDate(LocalDate.now().plusDays(10));
//            task1.setStatus(Task.Status.IN_PROGRESS);
//            taskService.createTask(task1);
//
//            Task task2 = new Task();
//            task2.setTitle("Design Database Schema");
//            task2.setDescription("Create optimized database schema for the task management system with proper relationships and constraints.");
//            task2.setAssignedUser(savedUser2);
//            task2.setStartDate(LocalDate.now().minusDays(3));
//            task2.setDueDate(LocalDate.now().plusDays(7));
//            task2.setStatus(Task.Status.PENDING);
//            taskService.createTask(task2);
//
//            Task task3 = new Task();
//            task3.setTitle("Implement Authentication System");
//            task3.setDescription("Develop secure user authentication with role-based access control.");
//            task3.setAssignedUser(savedUser1);
//            task3.setStartDate(LocalDate.now().minusDays(10));
//            task3.setDueDate(LocalDate.now().minusDays(2));
//            task3.setStatus(Task.Status.COMPLETED);
//            taskService.createTask(task3);
//
//            Task task4 = new Task();
//            task4.setTitle("Setup CI/CD Pipeline");
//            task4.setDescription("Configure continuous integration and deployment pipeline for automated testing and deployment.");
//            task4.setAssignedUser(savedUser2);
//            task4.setStartDate(LocalDate.now().minusDays(15));
//            task4.setDueDate(LocalDate.now().minusDays(1));
//            task4.setStatus(Task.Status.IN_PROGRESS);
//            taskService.createTask(task4);

            System.out.println("Sample data created successfully!");
        }
    }
}