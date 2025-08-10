function displayCategories(cuisines) {
    const categoriesGrid = document.getElementById('categories-grid');
    categoriesGrid.innerHTML = '';

    cuisines.forEach(cuisine => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <img src="${getRestaurantImage(cuisine)}" alt="${cuisine}" class="category-img">
            <h3>${cuisine}</h3>
        `;
        categoriesGrid.appendChild(categoryCard);
    });
}

// Restaurant Data - will be fetched from API
let restaurants = [];

// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// Cart functionality
let cart = [];
let cartTotal = 0;

// DOM Elements
const restaurantsGrid = document.getElementById('restaurants-grid');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const closeCartBtn = document.getElementById('close-cart');
const cartBtn = document.querySelector('.cart');

// Fetch restaurants from API
async function fetchRestaurants() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            showError('Please sign in to view restaurants');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/restaurants`, {
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dbRestaurants = await response.json();

        // Get unique cuisines
        const cuisines = [...new Set(dbRestaurants.map(r => r.cuisine))];
        displayCategories(cuisines);
        
        // Transform DB restaurants to match frontend format with additional UI data
        restaurants = dbRestaurants.map((restaurant, index) => ({
            id: restaurant._id,
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            rating: 4.5, // Default rating since not in DB
            deliveryTime: "30-40 min", // Default delivery time
            deliveryFee: "₹40", // Default delivery fee
            image: getRestaurantImage(restaurant.cuisine), // Get image based on cuisine
            minOrder: "₹200", // Default minimum order
            offers: ["Fresh & Hot"] // Default offers
        }));

        displayRestaurants();
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        showError('Failed to load restaurants. Please try again.');
    }
}

// Get appropriate image based on cuisine type
function getRestaurantImage(cuisine) {
    const imageMap = {
        'North Indian': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        'Italian': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        'Japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    };
    
    return imageMap[cuisine] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
}

// Enhanced notification system\nfunction showNotification(message, type = 'success') {\n    // Remove existing notifications\n    const existingNotifications = document.querySelectorAll('.notification');\n    existingNotifications.forEach(n => n.remove());\n    \n    const notification = document.createElement('div');\n    notification.className = `notification ${type}`;\n    notification.innerHTML = `\n        <div style=\"display: flex; align-items: center; gap: 12px;\">\n            <i class=\"fas ${\n                type === 'success' ? 'fa-check-circle' : \n                type === 'error' ? 'fa-times-circle' : 'fa-info-circle'\n            }\"></i>\n            <span>${message}</span>\n        </div>\n    `;\n    \n    document.body.appendChild(notification);\n    \n    // Trigger animation\n    setTimeout(() => notification.classList.add('show'), 100);\n    \n    // Remove after delay\n    setTimeout(() => {\n        notification.classList.remove('show');\n        setTimeout(() => notification.remove(), 300);\n    }, 4000);\n}\n\n// Show loading state\nfunction showLoading() {\n    const restaurantsGrid = document.getElementById('restaurants-grid');\n    if (restaurantsGrid) {\n        restaurantsGrid.innerHTML = `\n            <div style=\"grid-column: 1 / -1; text-align: center; padding: 60px 20px;\">\n                <div class=\"loading-spinner\" style=\"margin: 0 auto 20px;\"></div>\n                <h3 style=\"color: #333; margin-bottom: 8px;\">Loading Restaurants</h3>\n                <p style=\"color: #666;\">Finding the best restaurants near you...</p>\n            </div>\n        `;\n    }\n}\n\n// Show error message to user
function showError(message) {
    const restaurantsGrid = document.getElementById('restaurants-grid');
    if (restaurantsGrid) {
        restaurantsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                <h3>${message}</h3>
                <p>Please refresh the page or try again later.</p>
            </div>
        `;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    fetchRestaurants(); // Fetch from API instead of displaying hardcoded data
    setupEventListeners();
    setupSearchFunctionality();
    setupSmoothScrolling();
    setupAnimations();
});

// Display restaurants
function displayRestaurants() {
    restaurantsGrid.innerHTML = '';
    
    restaurants.forEach(restaurant => {
        const restaurantCard = createRestaurantCard(restaurant);
        restaurantsGrid.appendChild(restaurantCard);
    });
}

// Create restaurant card
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.innerHTML = `
        <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-img">
        <div class="restaurant-info">
            <h3 class="restaurant-name">${restaurant.name}</h3>
            <p class="restaurant-cuisine">${restaurant.cuisine}</p>
            <div class="restaurant-rating">
                <span class="rating-stars">${'★'.repeat(Math.floor(restaurant.rating))}${'☆'.repeat(5 - Math.floor(restaurant.rating))}</span>
                <span class="rating-text">${restaurant.rating}</span>
            </div>
            <div class="restaurant-delivery">
                <span>${restaurant.deliveryTime}</span>
                <span>${restaurant.deliveryFee}</span>
            </div>
            <div class="restaurant-offers">
                ${restaurant.offers.map(offer => `<span class="offer-tag">${offer}</span>`).join('')}
            </div>
            <button class="add-to-cart-btn" onclick='addToCart("${restaurant.id}")'>
                Add to Cart
            </button>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        // Prevent navigation when clicking inside the Add to Cart button
        if (e.target && e.target.closest && e.target.closest('.add-to-cart-btn')) {
            return;
        }
        window.location.href = `restaurant.html?id=${restaurant.id}`;
    });
    
    return card;
}

// Add to cart functionality
function addToCart(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    const existingItem = cart.find(item => item.id === restaurantId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: restaurant.id,
            name: restaurant.name,
            price: Math.floor(Math.random() * 200) + 100, // Random price for demo
            image: restaurant.image,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${restaurant.name} added to cart!`);
}

// Update cart display
function updateCart() {
    // Safely update cart count if element exists
    if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    if (cartItems) {
        cartItems.innerHTML = '';
    }
    cartTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        if (cartItems) {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        }
    });
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `₹${cartTotal}`;
    }
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== itemId);
    }
    
    updateCart();
}


// Setup event listeners
function setupEventListeners() {
    // Cart modal
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.classList.add('active');
    });
    
    closeCartBtn.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });
    
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.search-input, .hero-search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterRestaurants(query);
        });
    });
    
    // Find food button
    const findFoodBtn = document.querySelector('.find-food-btn');
    findFoodBtn.addEventListener('click', function() {
        const locationInput = document.querySelector('.hero-search-input');
        if (locationInput.value.trim()) {
            showNotification(`Searching for restaurants in ${locationInput.value}...`);
        } else {
            showNotification('Please enter a delivery location');
        }
    });
    
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            showNotification(`Browsing ${category} restaurants...`);
        });
    });
    
    // Offer cards
    const offerCards = document.querySelectorAll('.offer-card');
    offerCards.forEach(card => {
        card.addEventListener('click', function() {
            const offer = this.querySelector('h3').textContent;
            showNotification(`Applied ${offer}!`);
        });
    });
}

// Search functionality
function setupSearchFunctionality() {
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput.value.trim()) {
            showNotification(`Searching for "${searchInput.value}"...`);
        }
    });
}

// Filter restaurants
function filterRestaurants(query) {
    const filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query)
    );
    
    restaurantsGrid.innerHTML = '';
    filteredRestaurants.forEach(restaurant => {
        const restaurantCard = createRestaurantCard(restaurant);
        restaurantsGrid.appendChild(restaurantCard);
    });
}

// Smooth scrolling
function setupSmoothScrolling() {
const navLinks = document.querySelectorAll('.nav-link:not([href="signin.html"])');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.restaurant-card, .category-card, .offer-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .offer-tag {
        display: inline-block;
        background: #fc8019;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-right: 8px;
        margin-bottom: 8px;
    }
    
    .restaurant-offers {
        margin-bottom: 12px;
    }
`;
document.head.appendChild(style);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartModal && cartModal.classList.contains('active')) {
        cartModal.classList.remove('active');
    }
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced search
const debouncedSearch = debounce(function(query) {
    filterRestaurants(query);
}, 300);

// Update search to use debounced function
document.querySelectorAll('.search-input, .hero-search-input').forEach(input => {
    input.addEventListener('input', function() {
        debouncedSearch(this.value.toLowerCase());
    });
});

// Add loading states (inline helper names to avoid clashing with page-level showLoading)
function showInlineLoading(element) {
    if (!element) return;
    element.innerHTML = '<div class="loading"></div>';
}

function hideInlineLoading(element) {
    if (!element) return;
    element.innerHTML = '';
}

// Initialize with a welcome message
setTimeout(() => {
    showNotification('Welcome to Swiggy Clone! 🍕');
}, 1000);