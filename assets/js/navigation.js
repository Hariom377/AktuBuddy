/* ====================================
   AKTUBUDDY - NAVIGATION JAVASCRIPT
   Menu system, breadcrumbs, and routing
   ==================================== */

class AKTUBuddyNavigation {
    constructor() {
        this.currentPage = window.location.pathname;
        this.breadcrumbs = [];
        this.navigationHistory = [];
        this.menuItems = [];
        
        this.init();
    }
    
    init() {
        this.loadMenuStructure();
        this.setupBreadcrumbs();
        this.setupNavigationHistory();
        this.setupKeyboardNavigation();
        this.setupMegaMenu();
    }
    
    // Load navigation menu structure
    loadMenuStructure() {
        this.menuItems = [
            {
                title: 'Home',
                href: '/',
                icon: 'fas fa-home',
                description: 'Main dashboard'
            },
            {
                title: 'Subjects',
                href: '/pages/subjects/',
                icon: 'fas fa-book',
                description: 'Browse all subjects',
                submenu: [
                    {
                        title: 'CSE Subjects',
                        href: '/pages/subjects/cse-subjects.html',
                        description: 'Computer Science Engineering'
                    },
                    {
                        title: 'IT Subjects',
                        href: '/pages/subjects/it-subjects.html',
                        description: 'Information Technology'
                    },
                    {
                        title: 'ECE Subjects',
                        href: '/pages/subjects/ece-subjects.html',
                        description: 'Electronics & Communication'
                    },
                    {
                        title: 'ME Subjects',
                        href: '/pages/subjects/me-subjects.html',
                        description: 'Mechanical Engineering'
                    },
                    {
                        title: 'EE Subjects',
                        href: '/pages/subjects/ee-subjects.html',
                        description: 'Electrical Engineering'
                    },
                    {
                        title: 'CE Subjects',
                        href: '/pages/subjects/ce-subjects.html',
                        description: 'Civil Engineering'
                    }
                ]
            },
            {
                title: 'MCQ Practice',
                href: '/pages/mcq/',
                icon: 'fas fa-question-circle',
                description: 'Practice multiple choice questions',
                submenu: [
                    {
                        title: 'Engineering Mathematics-I',
                        href: '/pages/mcq/engineering-mathematics-i.html',
                        description: 'Calculus and differential equations'
                    },
                    {
                        title: 'Engineering Chemistry',
                        href: '/pages/mcq/engineering-chemistry.html',
                        description: 'Chemical principles and reactions'
                    },
                    {
                        title: 'Basic Electronics',
                        href: '/pages/mcq/basic-electronics.html',
                        description: 'Electronic circuits and components'
                    },
                    {
                        title: 'Programming',
                        href: '/pages/mcq/programming-problem-solving.html',
                        description: 'Programming concepts and problem solving'
                    },
                    {
                        title: 'Engineering Physics',
                        href: '/pages/mcq/engineering-physics.html',
                        description: 'Physics principles and applications'
                    }
                ]
            },
            {
                title: 'Tools',
                href: '/pages/tools/',
                icon: 'fas fa-tools',
                description: 'Study tools and utilities',
                submenu: [
                    {
                        title: 'Calculator',
                        href: '/pages/tools/calculator.html',
                        description: 'Scientific calculator'
                    },
                    {
                        title: 'Progress Tracker',
                        href: '/pages/tools/progress-tracker.html',
                        description: 'Track your study progress'
                    }
                ]
            },
            {
                title: 'Support',
                href: '/pages/support/help.html',
                icon: 'fas fa-life-ring',
                description: 'Help and support',
                submenu: [
                    {
                        title: 'Help Center',
                        href: '/pages/support/help.html',
                        description: 'Get help and tutorials'
                    },
                    {
                        title: 'About Us',
                        href: '/pages/support/about.html',
                        description: 'Learn about AKTUBuddy'
                    },
                    {
                        title: 'Contact',
                        href: '/pages/support/contact.html',
                        description: 'Get in touch with us'
                    }
                ]
            }
        ];
    }
    
    // Setup breadcrumb navigation
    setupBreadcrumbs() {
        this.updateBreadcrumbs();
        
        // Update breadcrumbs on page change
        window.addEventListener('popstate', () => {
            this.updateBreadcrumbs();
        });
    }
    
    // Update breadcrumb display
    updateBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumbs');
        if (!breadcrumbContainer) return;
        
        const path = window.location.pathname;
        const breadcrumbs = this.generateBreadcrumbs(path);
        
        breadcrumbContainer.innerHTML = breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return `
                <span class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${isLast ? crumb.title : `<a href="${crumb.href}">${crumb.title}</a>`}
                    ${!isLast ? '<i class="fas fa-chevron-right"></i>' : ''}
                </span>
            `;
        }).join('');
    }
    
    // Generate breadcrumbs from path
    generateBreadcrumbs(path) {
        const breadcrumbs = [{ title: 'Home', href: '/' }];
        
        if (path === '/' || path === '/index.html') {
            return breadcrumbs;
        }
        
        const pathSegments = path.split('/').filter(segment => segment);
        let currentPath = '';
        
        pathSegments.forEach(segment => {
            currentPath += `/${segment}`;
            const title = this.getPageTitle(segment);
            breadcrumbs.push({
                title: title,
                href: currentPath
            });
        });
        
        return breadcrumbs;
    }
    
    // Get page title from segment
    getPageTitle(segment) {
        const titleMap = {
            'subjects': 'Subjects',
            'mcq': 'MCQ Practice',
            'tools': 'Tools',
            'support': 'Support',
            'cse-subjects': 'CSE Subjects',
            'it-subjects': 'IT Subjects',
            'ece-subjects': 'ECE Subjects',
            'me-subjects': 'ME Subjects',
            'ee-subjects': 'EE Subjects',
            'ce-subjects': 'CE Subjects',
            'calculator': 'Calculator',
            'progress-tracker': 'Progress Tracker',
            'help': 'Help Center',
            'about': 'About Us',
            'contact': 'Contact',
            'privacy': 'Privacy Policy',
            'terms': 'Terms & Conditions'
        };
        
        return titleMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Setup navigation history
    setupNavigationHistory() {
        // Save current page to history
        this.addToHistory(window.location.pathname, document.title);
        
        // Listen for page changes
        window.addEventListener('beforeunload', () => {
            this.saveNavigationHistory();
        });
        
        // Load saved history
        this.loadNavigationHistory();
    }
    
    // Add page to navigation history
    addToHistory(path, title) {
        const historyItem = {
            path: path,
            title: title,
            timestamp: Date.now()
        };
        
        this.navigationHistory.unshift(historyItem);
        
        // Keep only last 10 items
        if (this.navigationHistory.length > 10) {
            this.navigationHistory = this.navigationHistory.slice(0, 10);
        }
    }
    
    // Save navigation history to localStorage
    saveNavigationHistory() {
        try {
            localStorage.setItem('aktubuddy-nav-history', JSON.stringify(this.navigationHistory));
        } catch (error) {
            console.warn('Could not save navigation history:', error);
        }
    }
    
    // Load navigation history from localStorage
    loadNavigationHistory() {
        try {
            const saved = localStorage.getItem('aktubuddy-nav-history');
            if (saved) {
                this.navigationHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Could not load navigation history:', error);
        }
    }
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + H: Go to home
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                this.navigateToHome();
            }
            
            // Alt + S: Focus search
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                this.focusSearch();
            }
            
            // Alt + M: Toggle mobile menu
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                this.toggleMobileMenu();
            }
            
            // Arrow keys for navigation in menus
            if (e.target.closest('.nav-menu')) {
                this.handleMenuKeyboardNavigation(e);
            }
        });
    }
    
    // Handle keyboard navigation in menus
    handleMenuKeyboardNavigation(e) {
        const menuItems = document.querySelectorAll('.nav-link');
        const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
        
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % menuItems.length;
                menuItems[nextIndex].focus();
                break;
                
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
                menuItems[prevIndex].focus();
                break;
                
            case 'Enter':
            case ' ':
                e.preventDefault();
                document.activeElement.click();
                break;
                
            case 'Escape':
                this.closeMobileMenu();
                document.activeElement.blur();
                break;
        }
    }
    
    // Navigate to home
    navigateToHome() {
        window.location.href = '/';
    }
    
    // Focus search input
    focusSearch() {
        const searchInput = document.getElementById('searchInput') || document.getElementById('mobileSearchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Toggle mobile menu
    toggleMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.click();
        }
    }
    
    // Close mobile menu
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }
    
    // Setup mega menu functionality
    setupMegaMenu() {
        const dropdownItems = document.querySelectorAll('.dropdown');
        
        dropdownItems.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                // Mouse events
                dropdown.addEventListener('mouseenter', () => {
                    this.showDropdown(menu);
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    this.hideDropdown(menu);
                });
                
                // Keyboard events
                toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleDropdown(menu);
                    }
                });
                
                // Focus management
                toggle.addEventListener('focus', () => {
                    dropdown.classList.add('focused');
                });
                
                toggle.addEventListener('blur', () => {
                    setTimeout(() => {
                        if (!dropdown.contains(document.activeElement)) {
                            dropdown.classList.remove('focused');
                            this.hideDropdown(menu);
                        }
                    }, 100);
                });
            }
        });
    }
    
    // Show dropdown menu
    showDropdown(menu) {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateY(0)';
        menu.setAttribute('aria-hidden', 'false');
    }
    
    // Hide dropdown menu
    hideDropdown(menu) {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(-10px)';
        menu.setAttribute('aria-hidden', 'true');
    }
    
    // Toggle dropdown menu
    toggleDropdown(menu) {
        const isVisible = menu.style.visibility === 'visible';
        if (isVisible) {
            this.hideDropdown(menu);
        } else {
            this.showDropdown(menu);
        }
    }
    
    // Get current page info
    getCurrentPageInfo() {
        return {
            path: window.location.pathname,
            title: document.title,
            breadcrumbs: this.generateBreadcrumbs(window.location.pathname)
        };
    }
    
    // Navigate to page with tracking
    navigateToPage(url, title = '') {
        if (title) {
            this.addToHistory(url, title);
        }
        window.location.href = url;
    }
    
    // Get navigation history
    getNavigationHistory() {
        return this.navigationHistory;
    }
    
    // Clear navigation history
    clearNavigationHistory() {
        this.navigationHistory = [];
        this.saveNavigationHistory();
    }
}

// Initialize navigation system
document.addEventListener('DOMContentLoaded', () => {
    window.aktuBuddyNavigation = new AKTUBuddyNavigation();
});

// Export for global access
window.AKTUBuddyNavigation = AKTUBuddyNavigation;
