// Restaurant Data
const restaurants = [
    {
        id: 1,
        name: "Pizza Palace",
        cuisine: "Italian, Pizza",
        rating: 4.5,
        deliveryTime: "30-35 min",
        deliveryFee: "₹40",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        minOrder: "₹200",
        offers: ["50% OFF", "Free Delivery"]
    },
    {
        id: 2,
        name: "Burger House",
        cuisine: "American, Burgers",
        rating: 4.2,
        deliveryTime: "25-30 min",
        deliveryFee: "₹30",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        minOrder: "₹150",
        offers: ["30% OFF", "Free Delivery"]
    },
    {
        id: 3,
        name: "Spice Garden",
        cuisine: "Indian, Chinese",
        rating: 4.7,
        deliveryTime: "35-40 min",
        deliveryFee: "₹50",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        minOrder: "₹300",
        offers: ["20% OFF"]
    },
    {
        id: 4,
        name: "Sushi Master",
        cuisine: "Japanese, Sushi",
        rating: 4.8,
        deliveryTime: "40-45 min",
        deliveryFee: "₹60",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        minOrder: "₹400",
        offers: ["Free Delivery"]
    },
    {
        id: 5,
        name: "Taco Fiesta",
        cuisine: "Mexican, Tacos",
        rating: 4.3,
        deliveryTime: "20-25 min",
        deliveryFee: "₹25",
        image: "https://images.unsplash.com/photo-1565299585323-2d6f92036398?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        minOrder: "₹180",
        offers: ["40% OFF"]
    },
    {
        id: 6,
        name: "Dessert Paradise",
        cuisine: "Desserts, Ice Cream",
        rating: 4.6,
        deliveryTime: "15-20 min",
        deliveryFee: "₹20",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        minOrder: "₹100",
        offers: ["Buy 1 Get 1"]
    }
];

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

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    displayRestaurants();
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
            <button class="add-to-cart-btn" onclick="addToCart(${restaurant.id})">
                Add to Cart
            </button>
        </div>
    `;
    
    // Add hover effect
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
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
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartItems.innerHTML = '';
    cartTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = `₹${cartTotal}`;
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

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fc8019;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
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
    const navLinks = document.querySelectorAll('.nav-link');
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
    if (e.key === 'Escape' && cartModal.classList.contains('active')) {
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

// Add loading states
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}

function hideLoading(element) {
    element.innerHTML = '';
}

// Initialize with a welcome message
setTimeout(() => {
    showNotification('Welcome to Swiggy Clone! 🍕');
}, 1000);