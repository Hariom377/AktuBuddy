/* ====================================
   AKTUBUDDY - UTILS
   Helper functions for various operations
   ==================================== */

/**
 * Debounce function
 * Executes function only after a wait period without new calls.
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @return {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * Limits function calls to once per wait period.
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @return {Function} Throttled function
 */
function throttle(func, wait) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - Input string
 * @return {string} Sanitized string
 */
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

/**
 * Format numbers with commas (e.g., 1000 -> 1,000)
 * @param {number} num - Number to format
 * @return {string} Formatted number string
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Get URL query parameters as an object
 * @return {Object} Key-value pairs of parameters
 */
function getQueryParams() {
  const params = {};
  window.location.search.substring(1).split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return params;
}

/**
 * Set a URL query parameter without page reload
 * @param {string} key - Parameter key
 * @param {string} value - Parameter value
 */
function setQueryParam(key, value) {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.replaceState({}, '', url);
}

// Export globally
window.utils = {
  debounce,
  throttle,
  sanitizeHTML,
  formatNumber,
  getQueryParams,
  setQueryParam,
};
