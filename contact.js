// Contact Form Handling with Multi-Step Form
const contactForm = document.getElementById('contact-form');
let currentStep = 1;
const totalSteps = 3;

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    });
}

// Enhanced email validation
function isValidEmail(email) {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}

// Multi-step form navigation
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < stepNumber) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Update progress lines
    document.querySelectorAll('.progress-line').forEach((line, index) => {
        if (index < stepNumber - 1) {
            line.classList.add('completed');
        } else {
            line.classList.remove('completed');
        }
    });
    
    currentStep = stepNumber;
}

// Validate current step
function validateStep(stepNumber) {
    const step = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value.trim())) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showMessage("❌ Please fill in all required fields correctly.", "error");
    }
    
    return isValid;
}

// Next button handlers
document.querySelectorAll('.next-button').forEach(button => {
    button.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                showStep(currentStep + 1);
            }
        }
    });
});

// Previous button handlers
document.querySelectorAll('.prev-button').forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });
});

// Clear validation on input
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(239, 68, 68)') {
            this.style.borderColor = '';
        }
    });
});

// Form submission handler
if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        const submitBtn = this.querySelector('.submit-button');
        const originalBtnText = submitBtn.innerHTML;
        
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <span class="button-icon">⏳</span>
        `;

        const formData = new FormData(this);
        const url = "https://formsubmit.co/nextstep.civic@gmail.com";

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Success
            showMessage("✓ Message sent successfully! We'll get back to you soon.", "success");
            this.reset();
            showStep(1); // Reset to first step
            
            // Scroll to success message
            window.scrollTo({
                top: document.querySelector('.form-card').offsetTop - 100,
                behavior: 'smooth'
            });

        } catch (err) {
            console.error('Form submission error:', err);
            showMessage("❌ Something went wrong. Please try again or email us directly.", "error");
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Display messages
function showMessage(text, type) {
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());

    const box = document.createElement("div");
    box.className = `form-message ${type}`;
    box.innerHTML = text;
    box.setAttribute('role', 'alert');
    box.setAttribute('aria-live', 'polite');

    const formCard = document.querySelector(".form-card");
    if (formCard) {
        formCard.prepend(box);
        
        setTimeout(() => {
            box.style.opacity = '0';
            box.style.transform = 'translateY(-10px)';
            box.style.transition = 'all 0.3s ease';
            setTimeout(() => box.remove(), 300);
        }, 6000);
    }
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Availability Status
function updateAvailabilityStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();
    
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('availability-text');
    
    if (!statusDot || !statusText) return;
    
    // Check if it's during business hours (Mon-Fri 9-6, Sat 10-4)
    let isOnline = false;
    
    if (day >= 1 && day <= 5) {
        // Monday to Friday
        isOnline = hour >= 9 && hour < 18;
    } else if (day === 6) {
        // Saturday
        isOnline = hour >= 10 && hour < 16;
    }
    
    if (isOnline) {
        statusDot.classList.remove('offline');
        statusText.textContent = 'We\'re online now!';
    } else {
        statusDot.classList.add('offline');
        
        // Calculate next available time
        if (day === 0) {
            statusText.textContent = 'Back Monday at 9:00 AM';
        } else if (day === 6 && hour >= 16) {
            statusText.textContent = 'Back Monday at 9:00 AM';
        } else if (day >= 1 && day <= 5 && hour >= 18) {
            statusText.textContent = 'Back tomorrow at 9:00 AM';
        } else if (day >= 1 && day <= 5 && hour < 9) {
            statusText.textContent = 'Back today at 9:00 AM';
        } else if (day === 6 && hour < 10) {
            statusText.textContent = 'Back today at 10:00 AM';
        } else {
            statusText.textContent = 'Currently offline';
        }
    }
}

// Update availability on load and every minute
updateAvailabilityStatus();
setInterval(updateAvailabilityStatus, 60000);

// Handle newsletter form
function handleNewsletter(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('.newsletter-input');
    const email = emailInput.value;
    
    if (isValidEmail(email)) {
        alert('Thank you for subscribing to our newsletter!');
        event.target.reset();
    } else {
        alert('Please enter a valid email address.');
    }
}

// Make handleNewsletter available globally
window.handleNewsletter = handleNewsletter;

// Initialize form to first step
showStep(1);
