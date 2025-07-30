/* ====================================
   AKTUBUDDY - THEME MANAGER
   Handles dark/light theme switching and persistence
   ==================================== */

class ThemeManager {
  constructor(toggleElementId) {
    this.toggleButton = document.getElementById(toggleElementId);
    this.currentTheme = 'light';
    this.loadTheme();
    this.init();
  }

  init() {
    if (!this.toggleButton) return;

    this.toggleButton.addEventListener('click', () => this.toggleTheme());

    // Listen for system preference changes (optional)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('aktubuddy-theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('aktubuddy-theme');
    if (savedTheme) {
      this.applyTheme(savedTheme);
    } else {
      // Apply system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    localStorage.setItem('aktubuddy-theme', newTheme);
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.updateToggleButton();
  }

  updateToggleButton() {
    if (!this.toggleButton) return;
    const icon = this.toggleButton.querySelector('i');
    if (!icon) return;

    if (this.currentTheme === 'dark') {
      icon.className = 'fas fa-sun';
      this.toggleButton.setAttribute('aria-label', 'Switch to light theme');
    } else {
      icon.className = 'fas fa-moon';
      this.toggleButton.setAttribute('aria-label', 'Switch to dark theme');
    }
  }
}

// Usage:
// const themeManager = new ThemeManager('themeToggle');

// Export globally
window.ThemeManager = ThemeManager;
