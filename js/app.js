// app.js - Main application file that initializes all components

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    const database = db;
    
    // Initialize authentication
    const auth = new Auth(database);
    
    // Initialize UI
    const ui = new UI(database);
    
    // Initialize cart
    const cart = new Cart(database);
    
    // Update cart count on initial load
    cart.updateCartCount();
    
    // Load videos if user is logged in
    const currentUser = database.getCurrentUser();
    if (currentUser) {
        ui.loadVideos();
    }
    
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
    
    // Expose components to window for debugging (remove in production)
    window.app = {
        database,
        auth,
        ui,
        cart
    };
    
    console.log('Educational Platform initialized successfully!');
});
