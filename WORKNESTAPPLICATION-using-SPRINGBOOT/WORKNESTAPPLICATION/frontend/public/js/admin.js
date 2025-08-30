// Admin Dashboard JavaScript for WorkNest

// API Base URL
const API_BASE = '/api';

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

// Check authentication and redirect if not admin
function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'admin') {
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

// Load dashboard stats
async function loadDashboardStats() {
    try {
        showLoading('statsCards');
        
        const response = await fetch(`${API_BASE}/dashboard/admin`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            renderStatsCards(data);
            renderRecentTasks(data.recentTasks);
            renderRecentComments(data.recentComments);
        } else {
            document.getElementById('statsCards').innerHTML = '<div class="alert alert-danger">Failed to load dashboard stats</div>';
        }
    } catch (error) {
        console.error('Dashboard stats error:', error);
        document.getElementById('statsCards').innerHTML = '<div class="alert alert-danger">Network error occurred</div>';
    }
}

// Render stats cards
function renderStatsCards(data) {
    const statsCards = document.getElementById('statsCards');
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

// Render recent tasks
function renderRecentTasks(tasks) {
    const container = document.getElementById('recentTasks');
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent tasks found</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-card card mb-2 ${task.status}">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="card-title mb-1">${task.title}</h6>
                        <small class="text-muted">
                            <i class="fas fa-user me-1"></i>${task.assigned_user_name}
                            <i class="fas fa-calendar ms-2 me-1"></i>${new Date(task.due_date).toLocaleDateString()}
                        </small>
                    </div>
                    <span class="badge status-${task.status}">${task.status.replace('_', ' ').toUpperCase()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render recent comments
function renderRecentComments(comments) {
    const container = document.getElementById('recentComments');
    if (!comments || comments.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent comments found</p>';
        return;
    }

    container.innerHTML = comments.map(comment => `
        <div class="comment-item mb-2">
            <div class="comment-author">${comment.user_name}</div>
            <div class="comment-text">${comment.comment_text.substring(0, 100)}${comment.comment_text.length > 100 ? '...' : ''}</div>
            <div class="comment-time">${new Date(comment.created_at).toLocaleDateString()}</div>
        </div>
    `).join('');
}

// Load users
async function loadUsers() {
    try {
        showLoading('usersTable');
        
        const response = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            renderUsersTable(data.users);
        } else {
            document.getElementById('usersTable').innerHTML = '<div class="alert alert-danger">Failed to load users</div>';
        }
    } catch (error) {
        console.error('Users loading error:', error);
        document.getElementById('usersTable').innerHTML = '<div class="alert alert-danger">Network error occurred</div>';
    }
}

// Render users table
function renderUsersTable(users) {
    const container = document.getElementById('usersTable');
    if (!users || users.length === 0) {
        container.innerHTML = '<p class="text-muted">No users found</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td><span class="badge bg-${user.role === 'admin' ? 'primary' : 'secondary'}">${user.role}</span></td>
                            <td>${new Date(user.created_at).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})" ${user.role === 'admin' ? 'disabled' : ''}>
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Load tasks
async function loadTasks() {
    try {
        showLoading('tasksTable');
        
        const [tasksResponse, usersResponse] = await Promise.all([
            fetch(`${API_BASE}/tasks`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/users`, { headers: getAuthHeaders() })
        ]);

        if (tasksResponse.ok && usersResponse.ok) {
            const tasksData = await tasksResponse.json();
            const usersData = await usersResponse.json();
            
            renderTasksTable(tasksData.tasks);
            populateUserSelect(usersData.users);
        } else {
            document.getElementById('tasksTable').innerHTML = '<div class="alert alert-danger">Failed to load tasks</div>';
        }
    } catch (error) {
        console.error('Tasks loading error:', error);
        document.getElementById('tasksTable').innerHTML = '<div class="alert alert-danger">Network error occurred</div>';
    }
}

// Render tasks table
function renderTasksTable(tasks) {
    const container = document.getElementById('tasksTable');
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p class="text-muted">No tasks found</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tasks.map(task => `
                        <tr>
                            <td>
                                <strong>${task.title}</strong>
                                ${task.description ? `<br><small class="text-muted">${task.description.substring(0, 50)}...</small>` : ''}
                            </td>
                            <td>${task.assigned_user_name || 'Unassigned'}</td>
                            <td><span class="badge status-${task.status}">${task.status.replace('_', ' ').toUpperCase()}</span></td>
                            <td>${new Date(task.due_date).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Populate user select dropdown
function populateUserSelect(users) {
    const select = document.getElementById('assignedUser');
    select.innerHTML = '<option value="">Select User</option>' + 
        users.filter(user => user.role === 'user').map(user => 
            `<option value="${user.id}">${user.name}</option>`
        ).join('');
}

// Load comments
async function loadComments() {
    try {
        showLoading('commentsTable');
        
        const response = await fetch(`${API_BASE}/dashboard/admin`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            renderCommentsTable(data.recentComments);
        } else {
            document.getElementById('commentsTable').innerHTML = '<div class="alert alert-danger">Failed to load comments</div>';
        }
    } catch (error) {
        console.error('Comments loading error:', error);
        document.getElementById('commentsTable').innerHTML = '<div class="alert alert-danger">Network error occurred</div>';
    }
}

// Render comments table
function renderCommentsTable(comments) {
    const container = document.getElementById('commentsTable');
    if (!comments || comments.length === 0) {
        container.innerHTML = '<p class="text-muted">No comments found</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Task</th>
                        <th>Comment</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${comments.map(comment => `
                        <tr>
                            <td>${comment.user_name}</td>
                            <td>${comment.task_title}</td>
                            <td>${comment.comment_text.substring(0, 100)}${comment.comment_text.length > 100 ? '...' : ''}</td>
                            <td>${new Date(comment.created_at).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            loadUsers(); // Reload users table
        } else {
            alert('Failed to delete user');
        }
    } catch (error) {
        console.error('Delete user error:', error);
        alert('Network error occurred');
    }
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            loadTasks(); // Reload tasks table
        } else {
            alert('Failed to delete task');
        }
    } catch (error) {
        console.error('Delete task error:', error);
        alert('Network error occurred');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAdminAuth()) return;

    // Display admin name
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('adminName').textContent = user.name;

    // Load initial data
    loadDashboardStats();

    // Tab change handlers
    document.querySelector('a[href="#users"]').addEventListener('shown.bs.tab', loadUsers);
    document.querySelector('a[href="#tasks"]').addEventListener('shown.bs.tab', loadTasks);
    document.querySelector('a[href="#comments"]').addEventListener('shown.bs.tab', loadComments);

    // Add user form handler
    document.getElementById('addUserForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role')
        };

        try {
            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                this.reset();
                bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
                loadUsers();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add user');
            }
        } catch (error) {
            console.error('Add user error:', error);
            alert('Network error occurred');
        }
    });

    // Add task form handler
    document.getElementById('addTaskForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            assigned_user_id: parseInt(formData.get('assigned_user_id')),
            start_date: formData.get('start_date'),
            due_date: formData.get('due_date')
        };

        try {
            const response = await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                this.reset();
                bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
                loadTasks();
                loadDashboardStats(); // Refresh stats
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add task');
            }
        } catch (error) {
            console.error('Add task error:', error);
            alert('Network error occurred');
        }
    });
});