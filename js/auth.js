// auth.js - Handles user authentication functionality

// Authentication class
class Auth {
    constructor(database) {
        this.db = database;
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    // Set up event listeners for login form
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // Check if user is already logged in
    checkAuthStatus() {
        const currentUser = this.db.getCurrentUser();
        if (currentUser) {
            this.showDashboard(currentUser);
        }
    }

    // Handle login form submission
    login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate inputs
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        // Check if user exists
        const user = this.db.getUserByEmail(email);
        if (!user) {
            alert('User not found. Please check your email or sign up.');
            return;
        }

        // Check password (in a real app, this would involve hashing)
        if (user.password !== password) {
            alert('Incorrect password. Please try again.');
            return;
        }

        // Set current user and redirect to dashboard
        this.db.setCurrentUser(user);
        this.showDashboard(user);
    }

    // Signup functionality removed

    // Handle logout
    logout() {
        this.db.clearCurrentUser();
        this.db.clearCart();
        this.showLoginForm();
    }

    // Show login form
    showLoginForm() {
        document.getElementById('login-section').classList.add('active-section');
        document.getElementById('login-section').classList.remove('hidden-section');
        document.getElementById('dashboard-section').classList.add('hidden-section');
        document.getElementById('dashboard-section').classList.remove('active-section');
        document.getElementById('cart-section').classList.add('hidden-section');
        document.getElementById('cart-section').classList.remove('active-section');
        document.getElementById('video-player-section').classList.add('hidden-section');
        document.getElementById('video-player-section').classList.remove('active-section');
    }

    // Signup form functionality removed

    // Show dashboard
    showDashboard(user) {
        // Update user name in UI
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = user.name;
        }

        // Show dashboard section
        document.getElementById('dashboard-section').classList.add('active-section');
        document.getElementById('dashboard-section').classList.remove('hidden-section');
        document.getElementById('login-section').classList.add('hidden-section');
        document.getElementById('login-section').classList.remove('active-section');
        document.getElementById('cart-section').classList.add('hidden-section');
        document.getElementById('cart-section').classList.remove('active-section');
        document.getElementById('video-player-section').classList.add('hidden-section');
        document.getElementById('video-player-section').classList.remove('active-section');

        // Show videos section by default
        document.getElementById('videos-section').classList.add('active-content');
        document.getElementById('videos-section').classList.remove('hidden-section');
        document.getElementById('assignments-section').classList.add('hidden-section');
        document.getElementById('assignments-section').classList.remove('active-content');
    }
}
