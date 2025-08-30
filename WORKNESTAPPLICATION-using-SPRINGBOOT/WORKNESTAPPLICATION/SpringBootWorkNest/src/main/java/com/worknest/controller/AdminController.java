package com.worknest.controller;

import com.worknest.model.User;
import com.worknest.model.Task;
import com.worknest.model.Comment;
import com.worknest.service.UserService;
import com.worknest.service.TaskService;
import com.worknest.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private CommentService commentService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;


    @GetMapping("/dashboard")
    public String adminDashboard(Model model, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        model.addAttribute("currentUser", currentUser);
        
        // Get statistics
        Map<String, Long> taskStats = taskService.getTaskStatistics();
        model.addAttribute("taskStats", taskStats);
        
        // Get recent data
        List<Task> recentTasks = taskService.getRecentTasks(10);
        List<Comment> recentComments = commentService.getRecentComments(10);
        
        model.addAttribute("recentTasks", recentTasks);
        model.addAttribute("recentComments", recentComments);
        
        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String userManagement(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        model.addAttribute("newUser", new User());
        return "admin/users";
    }

    @PostMapping("/users")
    public String createUser(@ModelAttribute User user, RedirectAttributes redirectAttributes) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userService.createUser(user);
            redirectAttributes.addFlashAttribute("successMessage", "User created successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to create user: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            userService.deleteUser(id);
            redirectAttributes.addFlashAttribute("successMessage", "User deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to delete user: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }

    @GetMapping("/tasks")
    public String taskManagement(Model model) {
        List<Task> tasks = taskService.getAllTasks();
        List<User> users = userService.getUsersByRole(User.Role.USER);
        
        model.addAttribute("tasks", tasks);
        model.addAttribute("users", users);
        model.addAttribute("newTask", new Task());
        
        return "admin/tasks";
    }

    @PostMapping("/tasks")
    public String createTask(@ModelAttribute Task task, @RequestParam Long assignedUserId, RedirectAttributes redirectAttributes) {
        try {
            User assignedUser = userService.getUserById(assignedUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedUser(assignedUser);
            taskService.createTask(task);
            redirectAttributes.addFlashAttribute("successMessage", "Task created successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to create task: " + e.getMessage());
        }
        return "redirect:/admin/tasks";
    }

    @PostMapping("/tasks/{id}/delete")
    public String deleteTask(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            taskService.deleteTask(id);
            redirectAttributes.addFlashAttribute("successMessage", "Task deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to delete task: " + e.getMessage());
        }
        return "redirect:/admin/tasks";
    }

    @GetMapping("/comments")
    public String viewAllComments(Model model) {
        List<Comment> comments = commentService.getAllComments();
        List<Task> tasks = taskService.getAllTasks();
        model.addAttribute("comments", comments);
        model.addAttribute("tasks", tasks);
        return "admin/comments";
    }
    @PostMapping("/comments/add")
    public String addComment(@RequestParam Long taskId,
                             @RequestParam String commentText,
                             Authentication authentication,
                             RedirectAttributes redirectAttributes) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Task task = taskService.getTaskById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            commentService.createComment(task, currentUser, commentText);
            redirectAttributes.addFlashAttribute("successMessage", "Comment added successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to add comment: " + e.getMessage());
        }
        return "redirect:/admin/comments";
    }

    @GetMapping("/tasks/status/{status}")
    public String getTasksByStatus(@PathVariable String status, Model model) {
        List<Task> tasks;
        if ("delayed".equals(status)) {
            tasks = taskService.getDelayedTasks();
        } else {
            Task.Status taskStatus = Task.Status.valueOf(status.toUpperCase());
            tasks = taskService.getTasksByStatus(taskStatus);
        }
        model.addAttribute("tasks", tasks);
        model.addAttribute("status", status);
        return "admin/tasks-by-status";
    }
}