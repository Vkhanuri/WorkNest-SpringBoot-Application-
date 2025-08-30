package com.worknest.controller;

import com.worknest.model.User;
import com.worknest.model.Task;
import com.worknest.model.Comment;
import com.worknest.service.TaskService;
import com.worknest.service.UserService;
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
@RequestMapping("/user")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class UserController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private CommentService commentService;
    
    @Autowired 
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "user/register"; 
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute("user") User user, Model model) {
        if (userService.existsByEmail(user.getEmail())) {
            model.addAttribute("error", "Email already exists!");
            return "user/register";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.USER);
        userService.createUser(user);
        return "redirect:/login?registered";
    }

    
    

    @GetMapping("/dashboard")
    public String userDashboard(Model model, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        model.addAttribute("currentUser", currentUser);
        
        // Get user statistics
        Map<String, Long> taskStats = taskService.getUserTaskStatistics(currentUser);
        model.addAttribute("taskStats", taskStats);
        
        // Get recent tasks
        List<Task> recentTasks = taskService.getRecentUserTasks(currentUser, 5);
        model.addAttribute("recentTasks", recentTasks);
        
        return "user/dashboard";
    }

    @GetMapping("/tasks")
    public String myTasks(Model model, Authentication authentication, @RequestParam(required = false) String filter) {
        User currentUser = (User) authentication.getPrincipal();
        List<Task> tasks;
        
        if (filter != null && !filter.isEmpty()) {
            if ("delayed".equals(filter)) {
                tasks = taskService.getTasksByUser(currentUser).stream()
                        .filter(Task::isDelayed)
                        .toList();
            } else {
                Task.Status status = Task.Status.valueOf(filter.toUpperCase());
                tasks = taskService.getTasksByUser(currentUser).stream()
                        .filter(task -> task.getStatus() == status)
                        .toList();
            }
        } else {
            tasks = taskService.getTasksByUser(currentUser);
        }
        
        model.addAttribute("tasks", tasks);
        model.addAttribute("currentFilter", filter);
        return "user/tasks";
    }

    @GetMapping("/tasks/{id}")
    public String taskDetail(@PathVariable Long id, Model model, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        Task task = taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!task.getAssignedUser().getId().equals(currentUser.getId()) && 
            currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Access denied");
        }
        
        List<Comment> comments = commentService.getCommentsByTask(task);
        
        model.addAttribute("task", task);
        model.addAttribute("comments", comments);
        model.addAttribute("newComment", new Comment());
        
        return "user/task-detail";
    }

    @PostMapping("/tasks/{id}/status")
    public String updateTaskStatus(@PathVariable Long id, @RequestParam String status, 
                                 Authentication authentication, RedirectAttributes redirectAttributes) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Task.Status newStatus = Task.Status.valueOf(status.toUpperCase());
            taskService.updateTaskStatus(id, newStatus, currentUser);
            redirectAttributes.addFlashAttribute("successMessage", "Task status updated successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to update task status: " + e.getMessage());
        }
        return "redirect:/user/tasks";
    }

    @PostMapping("/tasks/{id}/comments")
    public String addComment(@PathVariable Long id, @RequestParam String commentText, 
                           Authentication authentication, RedirectAttributes redirectAttributes) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Task task = taskService.getTaskById(id)
                    .orElseThrow(() -> new RuntimeException("Task not found"));
            
            commentService.createComment(task, currentUser, commentText);
            redirectAttributes.addFlashAttribute("successMessage", "Comment added successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to add comment: " + e.getMessage());
        }
        return "redirect:/user/tasks/" + id;
    }
    @GetMapping("/tasks/new")
    public String showAddTaskForm(Model model) {
        model.addAttribute("task", new Task());
        return "user/add-task"; 
    }
    @PostMapping("/tasks/save")
    public String saveTask(@ModelAttribute Task task, Authentication authentication, RedirectAttributes redirectAttributes) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            task.setAssignedUser(currentUser); 
            taskService.createTask(task);
            redirectAttributes.addFlashAttribute("successMessage", "Task created successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to create task: " + e.getMessage());
        }
        return "redirect:/user/tasks";
    }
    @PostMapping("/tasks/{taskId}/assign")
    public String assignTaskToUser(@PathVariable Long taskId, Authentication authentication, RedirectAttributes redirectAttributes) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            taskService.assignTaskToUser(taskId, currentUser);
            redirectAttributes.addFlashAttribute("successMessage", "Task assigned to you successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to assign task: " + e.getMessage());
        }
        return "redirect:/user/tasks";
    }
    @PostMapping("/comments/{commentId}/delete")
    public String deleteComment(@PathVariable Long commentId,
                                Authentication authentication,
                                RedirectAttributes redirectAttributes) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            commentService.deleteComment(commentId, currentUser);
            redirectAttributes.addFlashAttribute("successMessage", "Comment deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to delete comment: " + e.getMessage());
        }
        return "redirect:/user/tasks"; 
    }
}