/* ============================================
   Cafee Dubai - Main JavaScript File
   ============================================ */

// ===== GLOBAL VARIABLES =====
let currentTestimonial = 1;
let testimonialInterval;
const testimonialTotal = 3;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    setupEventListeners();
    startAnimations();
});

// ===== INITIALIZATION =====
function initializeComponents() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Initialize testimonial slider
    startTestimonialSlider();
    
    // Initialize counters
    setupCounters();
    
    // Set initial language
    setInitialLanguage();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
    
    // Product buttons
    const productButtons = document.querySelectorAll('.product-card .btn');
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to ordering platform
            window.open('https://talabat.com/uae/cafee-dubai', '_blank');
        });
    });
    
    // Blog read more buttons
    const blogButtons = document.querySelectorAll('.read-more');
    blogButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Simulate blog navigation
            alert('Blog article coming soon! Stay tuned for our latest coffee insights.');
        });
    });
    
    // Contact links
    setupContactLinks();
}

// ===== NAVBAR SCROLL EFFECT =====
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ===== TESTIMONIAL SLIDER =====
function startTestimonialSlider() {
    // Auto-rotate testimonials every 5 seconds
    testimonialInterval = setInterval(() => {
        nextTestimonial();
    }, 5000);
}

function showTestimonial(n) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n > testimonialTotal) currentTestimonial = 1;
    if (n < 1) currentTestimonial = testimonialTotal;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[currentTestimonial - 1]) {
        slides[currentTestimonial - 1].classList.add('active');
    }
    if (dots[currentTestimonial - 1]) {
        dots[currentTestimonial - 1].classList.add('active');
    }
}

function nextTestimonial() {
    currentTestimonial++;
    showTestimonial(currentTestimonial);
}

function previousTestimonial() {
    currentTestimonial--;
    showTestimonial(currentTestimonial);
    
    // Reset auto-slider
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(nextTestimonial, 5000);
}

function currentTestimonialSlide(n) {
    currentTestimonial = n;
    showTestimonial(n);
    
    // Reset auto-slider
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(nextTestimonial, 5000);
}

// Make functions globally accessible for onclick handlers
window.nextTestimonial = nextTestimonial;
window.previousTestimonial = previousTestimonial;
window.currentTestimonial = currentTestimonialSlide;

// ===== ANIMATED COUNTERS =====
function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const options = {
        threshold: 0.7
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ===== NEWSLETTER FORM =====
function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type=\"email\"]').value;
    const messageElement = document.getElementById('newsletterMessage');
    
    // Basic email validation
    if (!isValidEmail(email)) {
        showMessage(messageElement, 'Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        showMessage(messageElement, 'Thank you for subscribing! You\\'ll receive our latest updates.', 'success');
        e.target.reset();
        
        // Store email in localStorage for demo purposes
        const subscribers = JSON.parse(localStorage.getItem('cafeeSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('cafeeSubscribers', JSON.stringify(subscribers));
        }
    }, 1000);
    
    // Show loading state
    showMessage(messageElement, 'Subscribing...', '');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `newsletter-message ${type}`;
    
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            element.textContent = '';
            element.className = 'newsletter-message';
        }, 5000);
    }
}

// ===== LANGUAGE SWITCHING =====
function setInitialLanguage() {
    const savedLanguage = localStorage.getItem('cafeeLanguage') || 'en';
    switchLanguage(savedLanguage);
}

function switchLanguage(lang) {
    const elements = document.querySelectorAll('[data-en], [data-ar]');
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Update language attributes
    htmlElement.setAttribute('lang', lang);
    htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    bodyElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Update content
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' && element.type === 'email') {
                element.placeholder = text;
            } else {
                element.innerHTML = text;
            }
        }
    });
    
    // Update placeholder for newsletter input
    const newsletterInput = document.querySelector('.newsletter-form input[type=\"email\"]');
    if (newsletterInput) {
        const placeholder = newsletterInput.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) {
            newsletterInput.placeholder = placeholder;
        }
    }
    
    // Save language preference
    localStorage.setItem('cafeeLanguage', lang);
    
    // Refresh AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Make switchLanguage globally accessible
window.switchLanguage = switchLanguage;

// ===== CONTACT LINKS =====
function setupContactLinks() {
    // Phone number click to call
    const phoneLinks = document.querySelectorAll('a[href^=\"tel:\"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Analytics tracking could go here
            console.log('Phone call initiated:', this.href);
        });
    });
    
    // Email links
    const emailLinks = document.querySelectorAll('a[href^=\"mailto:\"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Analytics tracking could go here
            console.log('Email initiated:', this.href);
        });
    });
}

// ===== ANIMATIONS =====
function startAnimations() {
    // Coffee beans floating animation
    createFloatingBeans();
    
    // Hero coffee cup pulse effect
    const coffeeCup = document.querySelector('.coffee-cup-animation');
    if (coffeeCup) {
        setInterval(() => {
            coffeeCup.style.transform = 'scale(1.05)';
            setTimeout(() => {
                coffeeCup.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
}

function createFloatingBeans() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create additional floating elements
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const bean = document.createElement('div');
            bean.className = 'floating-bean';
            bean.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                animation: floatUp ${Math.random() * 10 + 15}s linear infinite;
                z-index: 1;
            `;
            
            hero.appendChild(bean);
            
            // Remove after animation
            setTimeout(() => {
                if (bean.parentNode) {
                    bean.parentNode.removeChild(bean);
                }
            }, 25000);
        }, i * 3000);
    }
}

// ===== SCROLL TO TOP =====
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class=\"fas fa-arrow-up\"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--coffee-brown);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
}

// ===== LAZY LOADING =====
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) originalScrollHandler();
        }, 10);
    };
    
    // Preload critical images
    const criticalImages = [
        'images/hero-coffee.jpg',
        'images/latte.jpg',
        'images/signature-coffee.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ===== ACCESSIBILITY =====
function enhanceAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add focus indicators for better accessibility
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 3px solid var(--golden-yellow) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== ERROR HANDLING =====
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        // Could send to analytics service
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
        // Could send to analytics service
    });
}

// ===== ANALYTICS & TRACKING =====
function setupAnalytics() {
    // Track button clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn, .read-more, .social-links a')) {
            const action = e.target.textContent.trim() || e.target.getAttribute('aria-label');
            console.log('Button clicked:', action);
            // Send to analytics service
        }
    });
    
    // Track section visibility
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Section viewed:', entry.target.id);
                // Send to analytics service
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => sectionObserver.observe(section));
}

// ===== CONTACT FORM ENHANCEMENT =====
function enhanceContactForms() {
    // Add real-time validation
    const emailInputs = document.querySelectorAll('input[type=\"email\"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#FF6B6B';
                this.setAttribute('aria-invalid', 'true');
            } else {
                this.style.borderColor = '';
                this.setAttribute('aria-invalid', 'false');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(255, 107, 107)') {
                this.style.borderColor = '';
                this.setAttribute('aria-invalid', 'false');
            }
        });
    });
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
    createScrollToTop();
    setupLazyLoading();
    optimizePerformance();
    enhanceAccessibility();
    setupErrorHandling();
    setupAnalytics();
    enhanceContactForms();
});

// ===== UTILITY FUNCTIONS =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== PROGRESSIVE ENHANCEMENT =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== EXPORT FUNCTIONS FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        switchLanguage,
        animateCounter
    };
}