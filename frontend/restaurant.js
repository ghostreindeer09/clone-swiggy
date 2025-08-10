document.addEventListener('DOMContentLoaded', () => {
    const restaurantDetails = document.getElementById('restaurant-details');
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');

    if (restaurantId) {
        fetchRestaurantDetails(restaurantId);
    }

    async function fetchRestaurantDetails(id) {
        try {
            const response = await fetch(`http://localhost:3000/restaurants/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const restaurant = await response.json();
            displayRestaurantDetails(restaurant);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
            restaurantDetails.innerHTML = '<p>Failed to load restaurant details. Please try again.</p>';
        }
    }

    function displayRestaurantDetails(restaurant) {
        restaurantDetails.innerHTML = `
            <h2>${restaurant.name}</h2>
            <p>${restaurant.cuisine}</p>
            <p>Rating: ${restaurant.rating}</p>
            <p>Delivery Time: ${restaurant.deliveryTime}</p>
        `;
    }
});

