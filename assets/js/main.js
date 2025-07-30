/* ====================================
   AKTUBUDDY - MAIN JAVASCRIPT
   Core functionality, initialization, and utilities
   ==================================== */

// Global Variables and Configuration
const AKTUBUDDY = {
    version: '1.0.0',
    apiUrl: '', // For future API integration
    currentUser: null,
    settings: {
        theme: 'light',
        language: 'en',
        notifications: true,
        animations: true
    },
    cache: new Map(),
    observers: []
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
async function initializeApp() {
    try {
        console.log('🚀 Initializing AKTUBuddy v' + AKTUBUDDY.version);
        
        // Load saved settings
        loadUserSettings();
        
        // Initialize theme
        initializeTheme();
        
        // Initialize components
        initializeNavigation();
        initializeSearch();
        initializeModals();
        initializeAnimations();
        initializeAccessibility();
        
        // Load initial data
        await loadInitialData();
        
        // Set up event listeners
        setupGlobalEventListeners();
        
        // Initialize performance monitoring
        initializePerformanceMonitoring();
        
        console.log('✅ AKTUBuddy initialized successfully');
        
        // Trigger custom event
        dispatchEvent(new CustomEvent('aktubuddyReady', {
            detail: { version: AKTUBUDDY.version }
        }));
        
    } catch (error) {
        console.error('❌ Failed to initialize AKTUBuddy:', error);
        showErrorMessage('Failed to initialize application. Please refresh the page.');
    }
}

// Load user settings from localStorage
function loadUserSettings() {
    try {
        const savedSettings = localStorage.getItem('aktubuddy-settings');
        if (savedSettings) {
            AKTUBUDDY.settings = { ...AKTUBUDDY.settings, ...JSON.parse(savedSettings) };
        }
    } catch (error) {
        console.warn('Could not load user settings:', error);
    }
}

// Save user settings to localStorage
function saveUserSettings() {
    try {
        localStorage.setItem('aktubuddy-settings', JSON.stringify(AKTUBUDDY.settings));
    } catch (error) {
        console.warn('Could not save user settings:', error);
    }
}

// Initialize theme system
function initializeTheme() {
    const savedTheme = localStorage.getItem('aktubuddy-theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme
    const theme = savedTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : savedTheme;
    applyTheme(theme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (AKTUBUDDY.settings.theme === 'auto') {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Apply theme to document
function applyTheme(theme) {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = theme === 'dark' ? '#1e293b' : '#2563eb';
}

// Initialize navigation system
function initializeNavigation() {
    // Set up mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
    
    // Set up smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Highlight active navigation items
    updateActiveNavigation();
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenu && mobileMenuBtn) {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = mobileMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        }
        
        // Update ARIA attributes
        const isOpen = mobileMenu.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenu && mobileMenuBtn) {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
        
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }
}

// Update active navigation based on scroll position
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Initialize modal system
function initializeModals() {
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

// Close modal
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Focus management
    const trigger = modal.getAttribute('data-trigger');
    if (trigger) {
        const triggerElement = document.querySelector(`[data-modal="${trigger}"]`);
        if (triggerElement) {
            triggerElement.focus();
        }
    }
}

// Initialize animations
function initializeAnimations() {
    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        fadeObserver.observe(el);
    });
}

// Initialize accessibility features
function initializeAccessibility() {
    // Skip to main content link
    addSkipToMainLink();
    
    // Improve focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Announce dynamic content changes to screen readers
    setupAriaLiveRegions();
}

// Add skip to main content link
function addSkipToMainLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Setup ARIA live regions for dynamic announcements
function setupAriaLiveRegions() {
    const announcer = document.createElement('div');
    announcer.id = 'aria-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
}

// Announce to screen readers
function announceToScreenReader(message) {
    const announcer = document.getElementById('aria-announcer');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}

// Load initial data
async function loadInitialData() {
    try {
        // Load subjects data if not already available
        if (!window.subjectsData) {
            console.log('Loading subjects data...');
            // In a real app, this would be an API call
            // For now, data is already embedded in the HTML
        }
        
        // Load user progress data
        loadUserProgress();
        
        // Initialize components that depend on data
        if (typeof renderSubjects === 'function') {
            renderSubjects();
        }
        
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// Load user progress from localStorage
function loadUserProgress() {
    try {
        const savedProgress = localStorage.getItem('aktubuddy-progress');
        if (savedProgress) {
            window.userProgress = JSON.parse(savedProgress);
        }
    } catch (error) {
        console.warn('Could not load user progress:', error);
    }
}

// Save user progress to localStorage
function saveUserProgress() {
    try {
        if (window.userProgress) {
            localStorage.setItem('aktubuddy-progress', JSON.stringify(window.userProgress));
        }
    } catch (error) {
        console.warn('Could not save user progress:', error);
    }
}

// Setup global event listeners
function setupGlobalEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Window resize handler
    window.addEventListener('resize', debounce(() => {
        // Recalculate layouts if needed
        updateLayoutOnResize();
    }, 250));
    
    // Online/offline status
    window.addEventListener('online', () => {
        showMessage('Back online!', 'success');
    });
    
    window.addEventListener('offline', () => {
        showMessage('You are offline. Some features may not work.', 'warning');
    });
    
    // Visibility change (tab focus)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            // Refresh data if needed
            console.log('Tab is now visible');
        }
    });
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.className.includes('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('aktubuddy-theme', newTheme);
    AKTUBUDDY.settings.theme = newTheme;
    saveUserSettings();
    
    announceToScreenReader(`Switched to ${newTheme} theme`);
}

// Update layout on window resize
function updateLayoutOnResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Recalculate any fixed elements
    updateFixedElements();
}

// Update fixed elements positioning
function updateFixedElements() {
    // Update any elements that need repositioning
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        // Recenter modal if needed
        centerModal(modal);
    });
}

// Center modal
function centerModal(modal) {
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.marginTop = '0';
        const rect = content.getBoundingClientRect();
        if (rect.height < window.innerHeight) {
            const topMargin = (window.innerHeight - rect.height) / 2;
            content.style.marginTop = `${Math.max(20, topMargin)}px`;
        }
    }
}

// Initialize performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Page load performance:', {
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                loadComplete: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                firstContentfulPaint: getFirstContentfulPaint()
            });
        }
    });
}

// Get First Contentful Paint timing
function getFirstContentfulPaint() {
    const entries = performance.getEntriesByType('paint');
    const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? Math.round(fcp.startTime) : null;
}

// Utility Functions
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Show message to user
function showMessage(message, type = 'info', duration = 3000) {
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: var(--${type === 'success' ? 'success-green' : type === 'warning' ? 'warning-yellow' : type === 'error' ? 'error-red' : 'info-blue'});
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(messageElement);
    
    // Animate in
    setTimeout(() => {
        messageElement.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        messageElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, duration);
}

// Show error message
function showErrorMessage(message) {
    showMessage(message, 'error', 5000);
}

// Show success message
function showSuccessMessage(message) {
    showMessage(message, 'success', 3000);
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set query parameter
function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
}

// Export functions for global access
window.AKTUBUDDY = AKTUBUDDY;
window.showMessage = showMessage;
window.showErrorMessage = showErrorMessage;
window.showSuccessMessage = showSuccessMessage;
window.announceToScreenReader = announceToScreenReader;
window.sanitizeHTML = sanitizeHTML;
window.formatNumber = formatNumber;
