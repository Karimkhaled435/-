// auth.js - Handles user authentication functionality

// Authentication class
class Auth {
    constructor(database) {
        this.db = database;
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    // Set up event listeners for login and signup forms
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        // Signup form submission
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.signup();
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

        // Switch between login and signup forms
        const signupLink = document.getElementById('signup-link');
        if (signupLink) {
            signupLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignupForm();
            });
        }

        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
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

    // Handle signup form submission
    signup() {
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate inputs
        if (!fullname || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Check if user already exists
        const existingUser = this.db.getUserByEmail(email);
        if (existingUser) {
            alert('Email already in use. Please use a different email or login.');
            return;
        }

        // Create new user
        const newUser = {
            name: fullname,
            email: email,
            password: password // In a real app, this would be hashed
        };

        // Add user to database
        const user = this.db.addUser(newUser);
        
        // Set current user and redirect to dashboard
        this.db.setCurrentUser(user);
        this.showDashboard(user);
    }

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
        document.getElementById('signup-section').classList.add('hidden-section');
        document.getElementById('signup-section').classList.remove('active-section');
        document.getElementById('dashboard-section').classList.add('hidden-section');
        document.getElementById('dashboard-section').classList.remove('active-section');
        document.getElementById('cart-section').classList.add('hidden-section');
        document.getElementById('cart-section').classList.remove('active-section');
        document.getElementById('video-player-section').classList.add('hidden-section');
        document.getElementById('video-player-section').classList.remove('active-section');
    }

    // Show signup form
    showSignupForm() {
        document.getElementById('signup-section').classList.add('active-section');
        document.getElementById('signup-section').classList.remove('hidden-section');
        document.getElementById('login-section').classList.add('hidden-section');
        document.getElementById('login-section').classList.remove('active-section');
        document.getElementById('dashboard-section').classList.add('hidden-section');
        document.getElementById('dashboard-section').classList.remove('active-section');
        document.getElementById('cart-section').classList.add('hidden-section');
        document.getElementById('cart-section').classList.remove('active-section');
        document.getElementById('video-player-section').classList.add('hidden-section');
        document.getElementById('video-player-section').classList.remove('active-section');
    }

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
        document.getElementById('signup-section').classList.add('hidden-section');
        document.getElementById('signup-section').classList.remove('active-section');
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
