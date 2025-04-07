// cart.js - Handles cart functionality

class Cart {
    constructor(database) {
        this.db = database;
        this.setupEventListeners();
    }

    // Set up event listeners for cart functionality
    setupEventListeners() {
        // Complete purchase button
        const completePurchaseBtn = document.getElementById('complete-purchase');
        if (completePurchaseBtn) {
            completePurchaseBtn.addEventListener('click', () => {
                this.completePurchase();
            });
        }
    }

    // Add video to cart
    addToCart(videoId) {
        const success = this.db.addToCart(videoId);
        if (success) {
            this.updateCartCount();
            return true;
        }
        return false;
    }

    // Remove video from cart
    removeFromCart(videoId) {
        this.db.removeFromCart(videoId);
        this.updateCartCount();
    }

    // Complete purchase
    completePurchase() {
        const cartItemIds = this.db.getCart();
        
        if (cartItemIds.length === 0) {
            alert('Your cart is empty.');
            return false;
        }
        
        // Process purchase
        const success = this.db.purchaseVideos(cartItemIds);
        
        if (success) {
            alert('Purchase completed successfully! You can now access your videos.');
            this.updateCartCount();
            return true;
        } else {
            alert('There was an error processing your purchase. Please try again.');
            return false;
        }
    }

    // Get cart items
    getCartItems() {
        const cartItemIds = this.db.getCart();
        const videos = this.db.getVideos();
        return videos.filter(video => cartItemIds.includes(video.id));
    }

    // Calculate cart total
    getCartTotal() {
        const cartItems = this.getCartItems();
        return cartItems.reduce((total, item) => total + item.price, 0);
    }

    // Update cart count in UI
    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.db.getCart().length;
            cartCount.textContent = count;
        }
    }

    // Clear cart
    clearCart() {
        this.db.clearCart();
        this.updateCartCount();
    }
}
