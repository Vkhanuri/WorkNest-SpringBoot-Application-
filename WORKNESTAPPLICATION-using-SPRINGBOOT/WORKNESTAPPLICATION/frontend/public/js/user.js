// User Dashboard JavaScript for WorkNest

// API Base URL
const API_BASE = '/api';

let currentTaskId = null;

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Get authorization headers
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// Check authentication and redirect if not user
function checkUserAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

// Show loading spinner
function showLoading(containerId) {
    document.getElementById(containerId).innerHTML = `
        <div class="spinner-container">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="loading-text">Loading...</div>
        </div>
    `;
}

// Load user dashboard stats
async function loadUserStats() {
    try {
        showLoading('userStatsCards');
        
        const response = await fetch(`${API_BASE}/dashboard/user`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            renderUserStatsCards(data);
            renderRecentUserTasks(data.recentTasks);
        } else {
            document.getElementById('userStatsCards').innerHTML = '<div class="alert alert-danger">Failed to load dashboard stats</div>';
        }
    } catch (error) {
        console.error('User stats error:', error);
        document.getElementById('userStatsCards').innerHTML = '<div class="alert alert-danger">Network error occurred</div>';
    }
}

// Render user stats cards
function renderUserStatsCards(data) {
    const statsCards = document.getElementById('userStatsCards');
    statsCards.innerHTML = `
        <div class="col-md-3 mb-3">
            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number">${data.taskStats.pending}</div>
                        <div class="stat-label">Pending Tasks</div>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="stat-card" style="background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number">${data.taskStats.in_progress}</div>
                        <div class="stat-label">In Progress</div>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-spinner"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="stat-card" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number">${data.taskStats.completed}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="stat-card" style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number">${data.taskStats.delayed}</div>
                        <div class="stat-label">Delayed</div>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render recent user tasks
function renderRecentUserTasks(tasks) {
    const container = document.getElementById('recentUserTasks');
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent tasks found</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-card card mb-2 ${task.status}" onclick="showTaskDetail(${task.id})">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="card-title mb-1">${task.title}</h6>
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>Due: ${new Date(task.due_date).toLocaleDateString()}
                        </small>
                    </div>
                    <span class="badge status-${task.status}">${task.status.replace('_', ' ').toUpperCase()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load my tasks
async function loadMyTasks(filter = 'all') {
    try {
        showLoading('myTasksList');
        
        const response = await fetch(`${API_BASE}/tasks/my-tasks`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            let filteredTasks = data.tasks;
            
            if (filter !== 'all') {
                if (filter === 'delayed') {
                    const currentDate = new Date();
                    filteredTasks = data.tasks.filter(task => 
                        task.status !== 'completed' && new Date(task.due_date) < currentDate
                    );
                } else {
                    filteredTasks = data.tasks.filter(task => task.status === filter);
                }
            }
            
            renderMyTasksList(filteredTasks);
        } else {
            document.getElementById('myTasksList').innerHTML = '<div class="alert alert-danger">Failed to load tasks</div>';
        }
    } catch (error) {
        console.error('My tasks loading error:', error);
        document.getElementById('myTasksList').innerHTML = '<div class="alert alert-danger">Network error occurred</div>';
    }
}

// Render my tasks list
function renderMyTasksList(tasks) {
    const container = document.getElementById('myTasksList');
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p class="text-muted">No tasks found</p>';
        return;
    }

    container.innerHTML = tasks.map(task => {
        const isDelayed = task.status !== 'completed' && new Date(task.due_date) < new Date();
        const statusClass = isDelayed ? 'delayed' : task.status;
        const statusText = isDelayed ? 'DELAYED' : task.status.replace('_', ' ').toUpperCase();
        
        return `
            <div class="task-card card mb-3 ${statusClass}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 class="card-title">${task.title}</h5>
                            <p class="card-text text-muted">${task.description || 'No description provided'}</p>
                        </div>
                        <span class="badge status-${statusClass}">${statusText}</span>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <small class="text-muted">
                                <i class="fas fa-calendar-alt me-1"></i>
                                Start: ${new Date(task.start_date).toLocaleDateString()}
                            </small>
                        </div>
                        <div class="col-md-6">
                            <small class="text-muted">
                                <i class="fas fa-calendar-check me-1"></i>
                                Due: ${new Date(task.due_date).toLocaleDateString()}
                            </small>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="showTaskDetail(${task.id})">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="showUpdateStatusModal(${task.id}, '${task.status}')">
                            <i class="fas fa-edit me-1"></i>Update Status
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="showAddCommentModal(${task.id})">
                            <i class="fas fa-comment me-1"></i>Add Comment
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Show task detail modal
async function showTaskDetail(taskId) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            const task = data.task;
            
            document.getElementById('taskDetailTitle').textContent = task.title;
            
            const isDelayed = task.status !== 'completed' && new Date(task.due_date) < new Date();
            const statusClass = isDelayed ? 'delayed' : task.status;
            const statusText = isDelayed ? 'DELAYED' : task.status.replace('_', ' ').toUpperCase();
            
            document.getElementById('taskDetailContent').innerHTML = `
                <div class="mb-3">
                    <h6>Description:</h6>
                    <p>${task.description || 'No description provided'}</p>
                </div>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <h6>Status:</h6>
                        <span class="badge status-${statusClass}">${statusText}</span>
                    </div>
                    <div class="col-md-4">
                        <h6>Start Date:</h6>
                        <p>${new Date(task.start_date).toLocaleDateString()}</p>
                    </div>
                    <div class="col-md-4">
                        <h6>Due Date:</h6>
                        <p>${new Date(task.due_date).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="mb-3">
                    <h6>Comments:</h6>
                    <div id="taskComments">
                        ${task.comments && task.comments.length > 0 ? 
                            task.comments.map(comment => `
                                <div class="comment-item mb-2">
                                    <div class="comment-author">${comment.user_name}</div>
                                    <div class="comment-text">${comment.comment_text}</div>
                                    <div class="comment-time">${new Date(comment.created_at).toLocaleDateString()}</div>
                                </div>
                            `).join('') : 
                            '<p class="text-muted">No comments yet</p>'
                        }
                    </div>
                </div>
            `;
            
            new bootstrap.Modal(document.getElementById('taskDetailModal')).show();
        } else {
            alert('Failed to load task details');
        }
    } catch (error) {
        console.error('Task detail error:', error);
        alert('Network error occurred');
    }
}

// Show update status modal
function showUpdateStatusModal(taskId, currentStatus) {
    currentTaskId = taskId;
    document.getElementById('taskStatus').value = currentStatus;
    new bootstrap.Modal(document.getElementById('updateStatusModal')).show();
}

// Show add comment modal
function showAddCommentModal(taskId) {
    currentTaskId = taskId;
    document.getElementById('commentText').value = '';
    new bootstrap.Modal(document.getElementById('addCommentModal')).show();
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    if (!checkUserAuth()) return;

    // Display user name
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('userName').textContent = user.name;

    // Load initial data
    loadUserStats();

    // Tab change handlers
    document.querySelector('a[href="#myTasks"]').addEventListener('shown.bs.tab', () => loadMyTasks());

    // Filter button handlers
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Load filtered tasks
            loadMyTasks(this.dataset.filter);
        });
    });

    // Update status form handler
    document.getElementById('updateStatusForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const statusData = {
            status: formData.get('status')
        };

        try {
            const response = await fetch(`${API_BASE}/tasks/${currentTaskId}/status`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(statusData)
            });

            if (response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('updateStatusModal')).hide();
                loadMyTasks(); // Reload tasks
                loadUserStats(); // Refresh stats
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Update status error:', error);
            alert('Network error occurred');
        }
    });

    // Add comment form handler
    document.getElementById('addCommentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const commentData = {
            comment_text: formData.get('comment_text')
        };

        try {
            const response = await fetch(`${API_BASE}/tasks/${currentTaskId}/comments`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(commentData)
            });

            if (response.ok) {
                this.reset();
                bootstrap.Modal.getInstance(document.getElementById('addCommentModal')).hide();
                loadMyTasks(); // Reload tasks to show updated comment count
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Add comment error:', error);
            alert('Network error occurred');
        }
    });
});