package com.worknest.service;

import com.worknest.model.Task;
import com.worknest.model.User;
import com.worknest.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByAssignedUserOrderByCreatedAtDesc(user);
    }

    public List<Task> getTasksByStatus(Task.Status status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getDelayedTasks() {
        return taskRepository.findDelayedTasks(LocalDate.now());
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setAssignedUser(taskDetails.getAssignedUser());
        task.setStartDate(taskDetails.getStartDate());
        task.setDueDate(taskDetails.getDueDate());
        task.setStatus(taskDetails.getStatus());
        
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long id, Task.Status status, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        if (!task.getAssignedUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only update status of tasks assigned to you");
        }
        
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Map<String, Long> getTaskStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("pending", taskRepository.countByStatus(Task.Status.PENDING));
        stats.put("in_progress", taskRepository.countByStatus(Task.Status.IN_PROGRESS));
        stats.put("completed", taskRepository.countByStatus(Task.Status.COMPLETED));
        stats.put("delayed", taskRepository.countDelayedTasks(LocalDate.now()));
        stats.put("total", taskRepository.count());
        return stats;
    }

    public Map<String, Long> getUserTaskStatistics(User user) {
        List<Task> userTasks = getTasksByUser(user);
        Map<String, Long> stats = new HashMap<>();
        
        long pending = userTasks.stream().mapToLong(t -> t.getStatus() == Task.Status.PENDING ? 1 : 0).sum();
        long inProgress = userTasks.stream().mapToLong(t -> t.getStatus() == Task.Status.IN_PROGRESS ? 1 : 0).sum();
        long completed = userTasks.stream().mapToLong(t -> t.getStatus() == Task.Status.COMPLETED ? 1 : 0).sum();
        long delayed = userTasks.stream().mapToLong(t -> t.isDelayed() ? 1 : 0).sum();
        
        stats.put("pending", pending);
        stats.put("in_progress", inProgress);
        stats.put("completed", completed);
        stats.put("delayed", delayed);
        stats.put("total", (long) userTasks.size());
        
        return stats;
    }

    public List<Task> getRecentTasks(int limit) {
        List<Task> allTasks = getAllTasks();
        return allTasks.size() <= limit ? allTasks : allTasks.subList(0, limit);
    }

    public List<Task> getRecentUserTasks(User user, int limit) {
        List<Task> userTasks = getTasksByUser(user);
        return userTasks.size() <= limit ? userTasks : userTasks.subList(0, limit);
    }
    public void assignTaskToUser(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setAssignedUser(user);
        taskRepository.save(task);
    }
}