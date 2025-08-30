package com.worknest.repository;

import com.worknest.model.Task;
import com.worknest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByAssignedUser(User user);
    
    List<Task> findByStatus(Task.Status status);
    
    List<Task> findByAssignedUserOrderByCreatedAtDesc(User user);
    
    List<Task> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status")
    long countByStatus(Task.Status status);
    
    @Query("SELECT t FROM Task t WHERE t.status != 'COMPLETED' AND t.dueDate < :currentDate")
    List<Task> findDelayedTasks(LocalDate currentDate);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.status != 'COMPLETED' AND t.dueDate < :currentDate")
    long countDelayedTasks(LocalDate currentDate);
}