// Enhanced notification system
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container') || document.body;
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-times-circle' : 'fa-info-circle'
            }"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Enhanced loading state
function setLoading(isLoading) {
    const btn = document.getElementById('signin-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    const overlay = document.getElementById('loading-overlay');
    
    if (isLoading) {
        btn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        overlay.classList.add('show');
    } else {
        btn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        overlay.classList.remove('show');
    }
}

// Form validation
function validateForm(email, password) {
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return false;
    }
    
    if (!email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!password) {
        showNotification('Please enter your password', 'error');
        return false;
    }
    
    return true;
}

// Enhanced form submission
document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate form
    if (!validateForm(email, password)) {
        return;
    }

    setLoading(true);

    try {
        const response = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Sign in successful! Redirecting...', 'success');
            localStorage.setItem('token', data.token);
            
            // Delay redirect for better UX
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showNotification(data.msg || 'Invalid credentials. Please try again.', 'error');
        }
    } catch (err) {
        console.error('Sign in error:', err);
        showNotification('Unable to connect to server. Please check your connection and try again.', 'error');
    } finally {
        setLoading(false);
    }
});

// Add input focus animations
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Add entrance animations
    const authWrapper = document.querySelector('.auth-form-wrapper');
    if (authWrapper) {
        authWrapper.style.opacity = '0';
        authWrapper.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            authWrapper.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            authWrapper.style.opacity = '1';
            authWrapper.style.transform = 'translateY(0)';
        }, 200);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to clear form
    if (e.key === 'Escape') {
        document.getElementById('signin-form').reset();
        document.querySelectorAll('.input-wrapper').forEach(wrapper => {
            wrapper.classList.remove('focused');
        });
    }
});

// Remember me functionality
document.addEventListener('DOMContentLoaded', function() {
    const rememberCheckbox = document.querySelector('.checkbox-input');
    const emailInput = document.getElementById('email');
    
    // Load saved email if "remember me" was checked
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
        emailInput.parentElement.classList.add('focused');
    }
    
    // Save email when "remember me" is checked
    document.getElementById('signin-form').addEventListener('submit', function() {
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedEmail', emailInput.value);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    });
});