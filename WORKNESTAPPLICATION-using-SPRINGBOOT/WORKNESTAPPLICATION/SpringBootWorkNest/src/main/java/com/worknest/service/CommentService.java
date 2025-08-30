package com.worknest.service;

import com.worknest.model.Comment;
import com.worknest.model.Task;
import com.worknest.model.User;
import com.worknest.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment createComment(Task task, User user, String commentText) {
        Comment comment = new Comment(task, user, commentText);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByTask(Task task) {
        return commentRepository.findByTaskOrderByCreatedAtAsc(task);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Comment> getRecentComments(int limit) {
        List<Comment> recentComments = commentRepository.findTop10ByOrderByCreatedAtDesc();
        return recentComments.size() <= limit ? recentComments : recentComments.subList(0, limit);
    }

    public void deleteComment(Long id, User user) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own comments");
        }
        
        commentRepository.deleteById(id);
    }
}