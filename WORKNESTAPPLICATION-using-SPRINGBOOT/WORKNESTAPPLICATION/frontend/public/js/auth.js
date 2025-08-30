// Authentication JavaScript for WorkNest

// API Base URL
const API_BASE = '/api';

// Show alert function
function showAlert(containerId, message, type = 'danger') {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

// Set loading state
function setLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Please wait...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text');
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Get user data from localStorage
function getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

// Redirect based on user role
function redirectBasedOnRole(user) {
    if (user.role === 'admin') {
        window.location.href = '/admin';
    } else {
        window.location.href = '/user';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in and redirect
    if (isAuthenticated() && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
        const user = getCurrentUser();
        if (user) {
            redirectBasedOnRole(user);
        }
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = loginForm.querySelector('button[type="submit"]');
            submitButton.setAttribute('data-original-text', submitButton.innerHTML);
            setLoading(submitButton, true);

            const formData = new FormData(loginForm);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                const result = await response.json();

                if (response.ok) {
                    // Store token and user data
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    
                    showAlert('loginAlert', 'Login successful! Redirecting...', 'success');
                    
                    // Redirect based on role
                    setTimeout(() => {
                        redirectBasedOnRole(result.user);
                    }, 1000);
                } else {
                    showAlert('loginAlert', result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                showAlert('loginAlert', 'Network error. Please try again.');
            } finally {
                setLoading(submitButton, false);
            }
        });
    }

    // Register form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = registerForm.querySelector('button[type="submit"]');
            submitButton.setAttribute('data-original-text', submitButton.innerHTML);
            setLoading(submitButton, true);

            const formData = new FormData(registerForm);
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');

            // Validate password confirmation
            if (password !== confirmPassword) {
                showAlert('registerAlert', 'Passwords do not match');
                setLoading(submitButton, false);
                return;
            }

            const registerData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: password,
                role: 'user' // Default role for registration
            };

            try {
                const response = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(registerData)
                });

                const result = await response.json();

                if (response.ok) {
                    // Store token and user data
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    
                    showAlert('registerAlert', 'Registration successful! Redirecting...', 'success');
                    
                    // Redirect to user dashboard
                    setTimeout(() => {
                        window.location.href = '/user';
                    }, 1000);
                } else {
                    showAlert('registerAlert', result.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showAlert('registerAlert', 'Network error. Please try again.');
            } finally {
                setLoading(submitButton, false);
            }
        });
    }
});