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
    const btn = document.getElementById('register-btn');
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
function validateForm(name, email, password) {
    if (!name || name.length < 2) {
        showNotification('Please enter your full name (at least 2 characters)', 'error');
        return false;
    }
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return false;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!password) {
        showNotification('Please enter a password', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return false;
    }
    
    const termsCheckbox = document.querySelector('.checkbox-input');
    if (!termsCheckbox.checked) {
        showNotification('Please accept the Terms & Conditions', 'error');
        return false;
    }
    
    return true;
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) {
        strength += 1;
    } else {
        feedback.push('at least 8 characters');
    }
    
    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('an uppercase letter');
    }
    
    if (/[a-z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('a lowercase letter');
    }
    
    if (/[0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('a number');
    }
    
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('a special character');
    }
    
    return { strength, feedback };
}

// Enhanced form submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate form
    if (!validateForm(name, email, password)) {
        return;
    }

    setLoading(true);

    try {
        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Account created successfully! Redirecting to sign in...', 'success');
            
            // Delay redirect for better UX
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 2000);
        } else {
            showNotification(data.msg || 'Registration failed. Please try again.', 'error');
        }
    } catch (err) {
        console.error('Registration error:', err);
        showNotification('Unable to connect to server. Please check your connection and try again.', 'error');
    } finally {
        setLoading(false);
    }
});

// Add input focus animations and validation
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

    // Real-time password strength checking
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Enter password';
            strengthText.style.color = '#6c757d';
            return;
        }
        
        const { strength, feedback } = checkPasswordStrength(password);
        
        let text = '';
        let color = '';
        let width = 0;
        
        switch (strength) {
            case 0:
            case 1:
                text = 'Very Weak';
                color = '#dc3545';
                width = 20;
                break;
            case 2:
                text = 'Weak';
                color = '#fd7e14';
                width = 40;
                break;
            case 3:
                text = 'Fair';
                color = '#ffc107';
                width = 60;
                break;
            case 4:
                text = 'Good';
                color = '#20c997';
                width = 80;
                break;
            case 5:
                text = 'Excellent';
                color = '#28a745';
                width = 100;
                break;
        }
        
        strengthFill.style.width = `${width}%`;
        strengthFill.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
        
        // Show improvement suggestions for weak passwords
        if (strength < 3 && feedback.length > 0) {
            strengthText.title = `Add: ${feedback.join(', ')}`;
        } else {
            strengthText.title = '';
        }
    });

    // Real-time name validation
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('input', function() {
        const name = this.value.trim();
        if (name.length > 0 && name.length < 2) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '';
        }
    });

    // Real-time email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && (!email.includes('@') || !email.includes('.'))) {
            this.style.borderColor = '#dc3545';
            showNotification('Please enter a valid email address', 'error');
        } else {
            this.style.borderColor = '';
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
        document.getElementById('register-form').reset();
        document.querySelectorAll('.input-wrapper').forEach(wrapper => {
            wrapper.classList.remove('focused');
        });
        // Reset password strength
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        if (strengthFill && strengthText) {
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Enter password';
            strengthText.style.color = '#6c757d';
        }
    }
});

// Form auto-save to prevent data loss
let autoSaveTimeout;
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    // Load saved form data
    inputs.forEach(input => {
        const saved = localStorage.getItem(`register_${input.id}`);
        if (saved && input.type !== 'password') { // Don't save passwords
            input.value = saved;
            if (saved) {
                input.parentElement.classList.add('focused');
            }
        }
    });
    
    // Auto-save form data
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                if (this.type !== 'password') { // Don't save passwords
                    localStorage.setItem(`register_${this.id}`, this.value);
                }
            }, 1000);
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`register_${input.id}`);
        });
    });
});