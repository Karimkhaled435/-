// ui.js - Handles UI interactions and rendering

class UI {
    constructor(database) {
        this.db = database;
        this.setupEventListeners();
        this.setupMobileMenu();
    }

    // Set up event listeners for UI interactions
    setupEventListeners() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Cart icon
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCartSection();
            });
        }

        // Back to videos button
        const backToVideosBtn = document.getElementById('back-to-videos');
        if (backToVideosBtn) {
            backToVideosBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDashboardSection('videos');
            });
        }

        // Back from video button
        const backFromVideoBtn = document.getElementById('back-from-video');
        if (backFromVideoBtn) {
            backFromVideoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDashboardSection('videos');
            });
        }

        // Search functionality
        const videoSearchInput = document.getElementById('video-search');
        if (videoSearchInput) {
            videoSearchInput.addEventListener('input', (e) => {
                this.searchVideos(e.target.value);
            });
        }

        const assignmentSearchInput = document.getElementById('assignment-search');
        if (assignmentSearchInput) {
            assignmentSearchInput.addEventListener('input', (e) => {
                this.searchAssignments(e.target.value);
            });
        }
    }

    // Set up mobile menu functionality
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('show');
            });
        }
    }

    // Switch between dashboard sections (videos, assignments)
    switchSection(section) {
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Show selected section
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(contentSection => {
            if (contentSection.id === `${section}-section`) {
                contentSection.classList.add('active-content');
                contentSection.classList.remove('hidden-section');
            } else {
                contentSection.classList.remove('active-content');
                contentSection.classList.add('hidden-section');
            }
        });

        // Load content for the selected section
        if (section === 'videos') {
            this.loadVideos();
        } else if (section === 'assignments') {
            this.loadAssignments();
        }
    }

    // Show dashboard section
    showDashboardSection(section = 'videos') {
        document.getElementById('dashboard-section').classList.add('active-section');
        document.getElementById('dashboard-section').classList.remove('hidden-section');
        document.getElementById('cart-section').classList.add('hidden-section');
        document.getElementById('cart-section').classList.remove('active-section');
        document.getElementById('video-player-section').classList.add('hidden-section');
        document.getElementById('video-player-section').classList.remove('active-section');

        this.switchSection(section);
    }

    // Show cart section
    showCartSection() {
        document.getElementById('cart-section').classList.add('active-section');
        document.getElementById('cart-section').classList.remove('hidden-section');
        document.getElementById('dashboard-section').classList.add('hidden-section');
        document.getElementById('dashboard-section').classList.remove('active-section');
        document.getElementById('video-player-section').classList.add('hidden-section');
        document.getElementById('video-player-section').classList.remove('active-section');

        this.loadCart();
    }

    // Show video player section
    showVideoPlayerSection(videoId) {
        document.getElementById('video-player-section').classList.add('active-section');
        document.getElementById('video-player-section').classList.remove('hidden-section');
        document.getElementById('dashboard-section').classList.add('hidden-section');
        document.getElementById('dashboard-section').classList.remove('active-section');
        document.getElementById('cart-section').classList.add('hidden-section');
        document.getElementById('cart-section').classList.remove('active-section');

        this.loadVideoPlayer(videoId);
    }

    // Load videos into videos section
    loadVideos() {
        const videosContainer = document.getElementById('videos-container');
        if (!videosContainer) return;

        // Clear container
        videosContainer.innerHTML = '';

        // Get all videos
        const videos = this.db.getVideos();
        const currentUser = this.db.getCurrentUser();

        if (videos.length === 0) {
            videosContainer.innerHTML = '<p>No videos available.</p>';
            return;
        }

        // Create video cards
        videos.forEach(video => {
            const isPurchased = this.db.isVideoPurchased(video.id);
            const isInCart = this.db.getCart().includes(video.id);
            
            const videoCard = document.createElement('div');
            videoCard.className = 'card';
            videoCard.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}" class="card-img">
                <div class="card-content">
                    <h3 class="card-title">${video.title}</h3>
                    <p class="card-description">${video.description}</p>
                    <p class="card-price">$${video.price.toFixed(2)}</p>
                    <div class="card-actions">
                        ${isPurchased ? 
                            `<button class="btn btn-primary watch-video" data-id="${video.id}">Watch Video</button>` : 
                            isInCart ? 
                            `<button class="btn btn-secondary" disabled>Added to Cart</button>` :
                            `<button class="btn btn-primary add-to-cart" data-id="${video.id}">Add to Cart</button>`
                        }
                    </div>
                </div>
            `;
            
            videosContainer.appendChild(videoCard);
            
            // Add event listeners to buttons
            if (isPurchased) {
                const watchBtn = videoCard.querySelector('.watch-video');
                watchBtn.addEventListener('click', () => {
                    this.showVideoPlayerSection(video.id);
                });
            } else if (!isInCart) {
                const addToCartBtn = videoCard.querySelector('.add-to-cart');
                addToCartBtn.addEventListener('click', () => {
                    this.db.addToCart(video.id);
                    this.updateCartCount();
                    this.loadVideos(); // Reload videos to update buttons
                });
            }
        });
    }

    // Load assignments into assignments section
    loadAssignments() {
        const assignmentsContainer = document.getElementById('assignments-container');
        if (!assignmentsContainer) return;

        // Clear container
        assignmentsContainer.innerHTML = '';

        // Get current user
        const currentUser = this.db.getCurrentUser();
        if (!currentUser) return;

        // Get purchased videos
        const purchasedVideoIds = currentUser.purchasedVideos || [];
        
        // Get assignments for purchased videos
        const allAssignments = this.db.getAssignments();
        const accessibleAssignments = allAssignments.filter(assignment => 
            purchasedVideoIds.includes(assignment.relatedVideoId)
        );

        if (accessibleAssignments.length === 0) {
            assignmentsContainer.innerHTML = '<p>No assignments available. Purchase videos to access related assignments.</p>';
            return;
        }

        // Create assignment cards
        accessibleAssignments.forEach(assignment => {
            const relatedVideo = this.db.getVideoById(assignment.relatedVideoId);
            
            const assignmentCard = document.createElement('div');
            assignmentCard.className = 'card';
            assignmentCard.innerHTML = `
                <div class="card-content">
                    <h3 class="card-title">${assignment.title}</h3>
                    <p class="card-description">${assignment.description}</p>
                    <p class="card-description">Related Video: ${relatedVideo ? relatedVideo.title : 'Unknown'}</p>
                    <p class="card-description">Due Date: ${assignment.dueDate}</p>
                    <div class="card-actions">
                        <button class="btn btn-primary view-assignment" data-id="${assignment.id}">View Details</button>
                    </div>
                </div>
            `;
            
            assignmentsContainer.appendChild(assignmentCard);
            
            // Add event listener to view button
            const viewBtn = assignmentCard.querySelector('.view-assignment');
            viewBtn.addEventListener('click', () => {
                // In a real application, this would show assignment details
                alert(`Assignment details for: ${assignment.title}`);
            });
        });
    }

    // Load cart items
    loadCart() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        const completePurchaseBtn = document.getElementById('complete-purchase');
        
        if (!cartItemsContainer || !cartTotalAmount || !completePurchaseBtn) return;

        // Clear container
        cartItemsContainer.innerHTML = '';

        // Get cart items
        const cartItemIds = this.db.getCart();
        const videos = this.db.getVideos();
        const cartItems = videos.filter(video => cartItemIds.includes(video.id));

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalAmount.textContent = '$0.00';
            completePurchaseBtn.disabled = true;
            return;
        }

        // Calculate total
        let total = 0;

        // Create cart item elements
        cartItems.forEach(item => {
            total += item.price;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <i class="fas fa-times remove-from-cart" data-id="${item.id}"></i>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            // Add event listener to remove button
            const removeBtn = cartItemElement.querySelector('.remove-from-cart');
            removeBtn.addEventListener('click', () => {
                this.db.removeFromCart(item.id);
                this.updateCartCount();
                this.loadCart();
            });
        });

        // Update total
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Enable purchase button
        completePurchaseBtn.disabled = false;
        
        // Add event listener to purchase button
        completePurchaseBtn.onclick = () => {
            this.completePurchase();
        };
    }

    // Complete purchase
    completePurchase() {
        const cartItemIds = this.db.getCart();
        
        if (cartItemIds.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        
        // Process purchase
        const success = this.db.purchaseVideos(cartItemIds);
        
        if (success) {
            alert('Purchase completed successfully! You can now access your videos.');
            this.updateCartCount();
            this.showDashboardSection('videos');
        } else {
            alert('There was an error processing your purchase. Please try again.');
        }
    }

    // Load video player
    loadVideoPlayer(videoId) {
        const video = this.db.getVideoById(videoId);
        if (!video) return;
        
        // Check if user has purchased this video
        if (!this.db.isVideoPurchased(videoId)) {
            alert('You need to purchase this video to watch it.');
            this.showDashboardSection('videos');
            return;
        }
        
        // Update video player
        const videoPlayer = document.getElementById('video-player');
        const videoTitle = document.getElementById('video-title');
        const videoDescription = document.getElementById('video-description-text');
        const relatedAssignmentsContainer = document.getElementById('related-assignments-container');
        
        if (videoPlayer) {
            videoPlayer.src = video.videoUrl;
            videoPlayer.load();
        }
        
        if (videoTitle) {
            videoTitle.textContent = video.title;
        }
        
        if (videoDescription) {
            videoDescription.textContent = video.description;
        }
        
        // Load related assignments
        if (relatedAssignmentsContainer) {
            relatedAssignmentsContainer.innerHTML = '';
            
            const relatedAssignments = this.db.getAssignmentsByVideoId(videoId);
            
            if (relatedAssignments.length === 0) {
                relatedAssignmentsContainer.innerHTML = '<p>No related assignments found.</p>';
                return;
            }
            
            relatedAssignments.forEach(assignment => {
                const assignmentElement = document.createElement('div');
                assignmentElement.className = 'related-assignment';
                assignmentElement.innerHTML = `
                    <h4>${assignment.title}</h4>
                    <p>${assignment.description}</p>
                    <p>Due Date: ${assignment.dueDate}</p>
                `;
                
                relatedAssignmentsContainer.appendChild(assignmentElement);
            });
        }
    }

    // Search videos
    searchVideos(query) {
        const videosContainer = document.getElementById('videos-container');
        if (!videosContainer) return;
        
        // Clear container
        videosContainer.innerHTML = '';
        
        // Get all videos
        const videos = this.db.getVideos();
        
        if (videos.length === 0) {
            videosContainer.innerHTML = '<p>No videos available.</p>';
            return;
        }
        
        // Filter videos by query
        const filteredVideos = videos.filter(video => 
            video.title.toLowerCase().includes(query.toLowerCase()) || 
            video.description.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredVideos.length === 0) {
            videosContainer.innerHTML = '<p>No videos match your search.</p>';
            return;
        }
        
        // Create video cards for filtered videos
        filteredVideos.forEach(video => {
            const isPurchased = this.db.isVideoPurchased(video.id);
            const isInCart = this.db.getCart().includes(video.id);
            
            const videoCard = document.createElement('div');
            videoCard.className = 'card';
            videoCard.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}" class="card-img">
                <div class="card-content">
                    <h3 class="card-title">${video.title}</h3>
                    <p class="card-description">${video.description}</p>
                    <p class="card-price">$${video.price.toFixed(2)}</p>
                    <div class="card-actions">
                        ${isPurchased ? 
                            `<button class="btn btn-primary watch-video" data-id="${video.id}">Watch Video</button>` : 
                            isInCart ? 
                            `<button class="btn btn-secondary" disabled>Added to Cart</button>` :
                            `<button class="btn btn-primary add-to-cart" data-id="${video.id}">Add to Cart</button>`
                        }
                    </div>
                </div>
            `;
            
            videosContainer.appendChild(videoCard);
            
            // Add event listeners to buttons
            if (isPurchased) {
                const watchBtn = videoCard.querySelector('.watch-video');
                watchBtn.addEventListener('click', () => {
                    this.showVideoPlayerSection(video.id);
                });
            } else if (!isInCart) {
                const addToCartBtn = videoCard.querySelector('.add-to-cart');
                addToCartBtn.addEventListener('click', () => {
                    this.db.addToCart(video.id);
                    this.updateCartCount();
                    this.loadVideos(); // Reload videos to update buttons
                });
            }
        });
    }

    // Search assignments
    searchAssignments(query) {
        const assignmentsContainer = document.getElementById('assignments-container');
        if (!assignmentsContainer) return;
        
        // Clear container
        assignmentsContainer.innerHTML = '';
        
        // Get current user
        const currentUser = this.db.getCurrentUser();
        if (!currentUser) return;
        
        // Get purchased videos
        const purchasedVideoIds = currentUser.purchasedVideos || [];
        
        // Get assignments for purchased videos
        const allAssignments = this.db.getAssignments();
        const accessibleAssignments = allAssignments.filter(assignment => 
            purchasedVideoIds.includes(assignment.relatedVideoId)
        );
        
        if (accessibleAssignments.length === 0) {
            assignmentsContainer.innerHTML = '<p>No assignments available. Purchase videos to access related assignments.</p>';
            return;
        }
        
        // Filter assignments by query
        const filteredAssignments = accessibleAssignments.filter(assignment => 
            assignment.title.toLowerCase().includes(query.toLowerCase()) || 
            assignment.description.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredAssignments.length === 0) {
            assignmentsContainer.innerHTML = '<p>No assignments match your search.</p>';
            return;
        }
        
        // Create assignment cards for filtered assignments
        filteredAssignments.forEach(assignment => {
            const relatedVideo = this.db.getVideoById(assignment.relatedVideoId);
            
            const assignmentCard = document.createElement('div');
            assignmentCard.className = 'card';
            assignmentCard.innerHTML = `
                <div class="card-content">
                    <h3 class="card-title">${assignment.title}</h3>
                    <p class="card-description">${assignment.description}</p>
                    <p class="card-description">Related Video: ${relatedVideo ? relatedVideo.title : 'Unknown'}</p>
                    <p class="card-description">Due Date: ${assignment.dueDate}</p>
                    <div class="card-actions">
                        <button class="btn btn-primary view-assignment" data-id="${assignment.id}">View Details</button>
                    </div>
                </div>
            `;
            
            assignmentsContainer.appendChild(assignmentCard);
            
            // Add event listener to view button
            const viewBtn = assignmentCard.querySelector('.view-assignment');
            viewBtn.addEventListener('click', () => {
                // In a real application, this would show assignment details
                alert(`Assignment details for: ${assignment.title}`);
            });
        });
    }

    // Update cart count in UI
    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.db.getCart().length;
            cartCount.textContent = count;
        }
    }
}
