/* ====================================
   AKTUBUDDY - SEARCH JAVASCRIPT
   Advanced search functionality with filtering
   ==================================== */

class AKTUBuddySearch {
    constructor() {
        this.searchData = [];
        this.searchResults = [];
        this.currentQuery = '';
        this.searchHistory = [];
        this.filters = {
            type: 'all', // all, subject, mcq, notes, tools
            branch: 'all',
            semester: 'all',
            difficulty: 'all'
        };
        
        this.init();
    }
    
    init() {
        this.buildSearchIndex();
        this.setupSearchInput();
        this.setupSearchFilters();
        this.setupSearchHistory();
        this.setupKeyboardShortcuts();
        this.setupVoiceSearch();
    }
    
    // Build comprehensive search index
    buildSearchIndex() {
        this.searchData = [];
        
        // Index subjects
        if (window.subjectsData) {
            Object.keys(window.subjectsData).forEach(branch => {
                Object.keys(window.subjectsData[branch]).forEach(semester => {
                    window.subjectsData[branch][semester].forEach(subject => {
                        this.searchData.push({
                            id: `subject-${subject.code}`,
                            type: 'subject',
                            title: subject.name,
                            subtitle: subject.code,
                            description: `${branch} - Semester ${semester}`,
                            keywords: [subject.name, subject.code, branch, `semester ${semester}`, subject.difficulty],
                            url: `/pages/subjects/${branch.toLowerCase()}-subjects.html`,
                            icon: subject.icon || 'fas fa-book',
                            branch: branch,
                            semester: semester,
                            difficulty: subject.difficulty,
                            metadata: {
                                mcqCount: subject.mcqCount,
                                notesCount: subject.notesCount,
                                mockTests: subject.mockTests
                            }
                        });
                    });
                });
            });
        }
        
        // Index MCQ topics
        if (window.subjectQuestions) {
            Object.keys(window.subjectQuestions).forEach(subjectName => {
                const questions = window.subjectQuestions[subjectName];
                const units = [...new Set(questions.map(q => q.unit))];
                
                units.forEach(unit => {
                    const unitQuestions = questions.filter(q => q.unit === unit);
                    this.searchData.push({
                        id: `mcq-${subjectName}-unit-${unit}`,
                        type: 'mcq',
                        title: `${subjectName} - Unit ${unit} MCQs`,
                        subtitle: `${unitQuestions.length} questions`,
                        description: `Practice questions for Unit ${unit}`,
                        keywords: [subjectName, `unit ${unit}`, 'mcq', 'questions', 'practice'],
                        url: `/pages/mcq/${subjectName.toLowerCase().replace(/\s+/g, '-')}.html`,
                        icon: 'fas fa-question-circle',
                        metadata: {
                            questionCount: unitQuestions.length,
                            unit: unit,
                            subject: subjectName
                        }
                    });
                });
            });
        }
        
        // Index tools
        const tools = [
            {
                id: 'tool-calculator',
                type: 'tool',
                title: 'Scientific Calculator',
                subtitle: 'Advanced calculator',
                description: 'Perform complex mathematical calculations',
                keywords: ['calculator', 'math', 'scientific', 'computation'],
                url: '/pages/tools/calculator.html',
                icon: 'fas fa-calculator'
            },
            {
                id: 'tool-progress',
                type: 'tool',
                title: 'Progress Tracker',
                subtitle: 'Study progress',
                description: 'Track your learning progress and achievements',
                keywords: ['progress', 'tracking', 'statistics', 'performance'],
                url: '/pages/tools/progress-tracker.html',
                icon: 'fas fa-chart-line'
            }
        ];
        
        this.searchData.push(...tools);
        
        // Index support pages
        const supportPages = [
            {
                id: 'support-help',
                type: 'support',
                title: 'Help Center',
                subtitle: 'Get help',
                description: 'Find answers to common questions',
                keywords: ['help', 'support', 'faq', 'assistance'],
                url: '/pages/support/help.html',
                icon: 'fas fa-life-ring'
            },
            {
                id: 'support-about',
                type: 'support',
                title: 'About Us',
                subtitle: 'Learn more',
                description: 'Learn about AKTUBuddy platform',
                keywords: ['about', 'information', 'team', 'mission'],
                url: '/pages/support/about.html',
                icon: 'fas fa-info-circle'
            },
            {
                id: 'support-contact',
                type: 'support',
                title: 'Contact Us',
                subtitle: 'Get in touch',
                description: 'Contact our support team',
                keywords: ['contact', 'support', 'email', 'help'],
                url: '/pages/support/contact.html',
                icon: 'fas fa-envelope'
            }
        ];
        
        this.searchData.push(...supportPages);
        
        console.log(`📊 Search index built with ${this.searchData.length} items`);
    }
    
    // Setup search input handlers
    setupSearchInput() {
        const searchInputs = document.querySelectorAll('#searchInput, #mobileSearchInput');
        const searchResults = document.getElementById('searchResults');
        
        searchInputs.forEach(input => {
            if (!input) return;
            
            // Input event for real-time search
            input.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                this.handleSearch(query);
            });
            
            // Focus events
            input.addEventListener('focus', () => {
                this.showSearchSuggestions();
            });
            
            input.addEventListener('blur', (e) => {
                // Delay hiding to allow clicking on results
                setTimeout(() => {
                    if (!this.isSearchResultsFocused()) {
                        this.hideSearchResults();
                    }
                }, 150);
            });
            
            // Keyboard navigation
            input.addEventListener('keydown', (e) => {
                this.handleSearchKeyboard(e);
            });
        });
        
        // Setup search results container
        if (searchResults) {
            searchResults.addEventListener('click', (e) => {
                const resultItem = e.target.closest('.search-result-item');
                if (resultItem) {
                    this.handleResultClick(resultItem);
                }
            });
        }
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });
    }
    
    // Handle search query
    handleSearch(query) {
        this.currentQuery = query;
        
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }
        
        // Perform search
        const results = this.search(query);
        this.displayResults(results);
        
        // Add to search history
        if (query.length >= 3) {
            this.addToSearchHistory(query);
        }
    }
    
    // Perform search with ranking
    search(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const searchTerms = normalizedQuery.split(/\s+/);
        
        const results = this.searchData
            .map(item => {
                const score = this.calculateRelevanceScore(item, normalizedQuery, searchTerms);
                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Limit to top 10 results
        
        return results;
    }
    
    // Calculate relevance score for search ranking
    calculateRelevanceScore(item, query, searchTerms) {
        let score = 0;
        
        // Exact title match (highest priority)
        if (item.title.toLowerCase() === query) {
            score += 100;
        }
        
        // Title starts with query
        if (item.title.toLowerCase().startsWith(query)) {
            score += 50;
        }
        
        // Title contains query
        if (item.title.toLowerCase().includes(query)) {
            score += 25;
        }
        
        // Subtitle matches
        if (item.subtitle && item.subtitle.toLowerCase().includes(query)) {
            score += 15;
        }
        
        // Description matches
        if (item.description && item.description.toLowerCase().includes(query)) {
            score += 10;
        }
        
        // Keywords match
        searchTerms.forEach(term => {
            item.keywords.forEach(keyword => {
                if (keyword.toLowerCase().includes(term)) {
                    score += 5;
                }
            });
        });
        
        // Apply filters
        if (this.filters.type !== 'all' && item.type !== this.filters.type) {
            score *= 0.1;
        }
        
        if (this.filters.branch !== 'all' && item.branch !== this.filters.branch) {
            score *= 0.1;
        }
        
        if (this.filters.semester !== 'all' && item.semester !== this.filters.semester) {
            score *= 0.1;
        }
        
        if (this.filters.difficulty !== 'all' && item.difficulty !== this.filters.difficulty) {
            score *= 0.1;
        }
        
        return score;
    }
    
    // Display search results
    displayResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${this.currentQuery}"</p>
                    <p class="search-suggestions">Try different keywords or check spelling</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = `
                <div class="search-results-header">
                    <span>Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${this.currentQuery}"</span>
                    <button class="search-clear" onclick="aktuBuddySearch.clearSearch()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${results.map(result => this.createResultHTML(result)).join('')}
            `;
        }
        
        this.showSearchResults();
    }
    
    // Create HTML for search result item
    createResultHTML(result) {
        const typeClass = `result-type-${result.type}`;
        const iconColor = {
            'subject': 'var(--primary-blue)',
            'mcq': 'var(--success-green)',
            'tool': 'var(--warning-yellow)',
            'support': 'var(--info-blue)'
        }[result.type] || 'var(--text-gray)';
        
        return `
            <div class="search-result-item ${typeClass}" data-url="${result.url}" data-type="${result.type}">
                <div class="result-icon" style="color: ${iconColor}">
                    <i class="${result.icon}"></i>
                </div>
                <div class="result-content">
                    <div class="result-title">${this.highlightQuery(result.title)}</div>
                    <div class="result-subtitle">${result.subtitle}</div>
                    <div class="result-description">${this.highlightQuery(result.description)}</div>
                    ${result.metadata ? this.createMetadataHTML(result.metadata) : ''}
                </div>
                <div class="result-type-badge">${result.type}</div>
            </div>
        `;
    }
    
    // Create metadata HTML
    createMetadataHTML(metadata) {
        const badges = [];
        
        if (metadata.mcqCount) {
            badges.push(`<span class="metadata-badge">${metadata.mcqCount} MCQs</span>`);
        }
        
        if (metadata.notesCount) {
            badges.push(`<span class="metadata-badge">${metadata.notesCount} Notes</span>`);
        }
        
        if (metadata.questionCount) {
            badges.push(`<span class="metadata-badge">${metadata.questionCount} Questions</span>`);
        }
        
        if (metadata.unit) {
            badges.push(`<span class="metadata-badge">Unit ${metadata.unit}</span>`);
        }
        
        return badges.length > 0 ? `<div class="result-metadata">${badges.join('')}</div>` : '';
    }
    
    // Highlight search query in text
    highlightQuery(text) {
        if (!this.currentQuery || !text) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(this.currentQuery)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // Escape special regex characters
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Show search results
    showSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'block';
            searchResults.setAttribute('aria-hidden', 'false');
        }
    }
    
    // Hide search results
    hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
            searchResults.setAttribute('aria-hidden', 'true');
        }
    }
    
    // Check if search results are focused
    isSearchResultsFocused() {
        const searchResults = document.getElementById('searchResults');
        return searchResults && searchResults.contains(document.activeElement);
    }
    
    // Show search suggestions
    showSearchSuggestions() {
        if (this.currentQuery.length < 2) {
            const suggestions = this.getPopularSearches();
            this.displaySuggestions(suggestions);
        }
    }
    
    // Get popular searches
    getPopularSearches() {
        return [
            'Engineering Mathematics',
            'Programming for Problem Solving',
            'Basic Electronics',
            'Engineering Chemistry',
            'Calculator',
            'MCQ Practice'
        ];
    }
    
    // Display search suggestions
    displaySuggestions(suggestions) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;
        
        searchResults.innerHTML = `
            <div class="search-suggestions-header">Popular Searches</div>
            ${suggestions.map(suggestion => `
                <div class="search-suggestion-item" onclick="aktuBuddySearch.selectSuggestion('${suggestion}')">
                    <i class="fas fa-search"></i>
                    <span>${suggestion}</span>
                </div>
            `).join('')}
        `;
        
        this.showSearchResults();
    }
    
    // Select search suggestion
    selectSuggestion(suggestion) {
        const searchInputs = document.querySelectorAll('#searchInput, #mobileSearchInput');
        searchInputs.forEach(input => {
            if (input) {
                input.value = suggestion;
            }
        });
        
        this.handleSearch(suggestion);
    }
    
    // Handle keyboard navigation in search
    handleSearchKeyboard(e) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults || searchResults.style.display === 'none') return;
        
        const resultItems = searchResults.querySelectorAll('.search-result-item, .search-suggestion-item');
        const currentFocused = document.activeElement;
        let currentIndex = Array.from(resultItems).indexOf(currentFocused);
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < resultItems.length - 1) {
                    resultItems[currentIndex + 1].focus();
                } else if (resultItems.length > 0) {
                    resultItems[0].focus();
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    resultItems[currentIndex - 1].focus();
                } else if (resultItems.length > 0) {
                    resultItems[resultItems.length - 1].focus();
                }
                break;
                
            case 'Enter':
                if (currentFocused && currentFocused.classList.contains('search-result-item')) {
                    e.preventDefault();
                    this.handleResultClick(currentFocused);
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                this.hideSearchResults();
                e.target.blur();
                break;
        }
    }
    
    // Handle result click
    handleResultClick(resultItem) {
        const url = resultItem.getAttribute('data-url');
        const type = resultItem.getAttribute('data-type');
        const title = resultItem.querySelector('.result-title').textContent;
        
        // Track search result click
        this.trackSearchClick(this.currentQuery, url, type);
        
        // Navigate to result
        window.location.href = url;
        
        // Hide search results
        this.hideSearchResults();
        
        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader(`Navigating to ${title}`);
        }
    }
    
    // Setup search filters
    setupSearchFilters() {
        // This would be implemented when filter UI is added
        console.log('Search filters ready');
    }
    
    // Setup search history
    setupSearchHistory() {
        this.loadSearchHistory();
        
        // Save history before page unload
        window.addEventListener('beforeunload', () => {
            this.saveSearchHistory();
        });
    }
    
    // Add to search history
    addToSearchHistory(query) {
        if (!query || query.length < 3) return;
        
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);
        
        // Add to beginning
        this.searchHistory.unshift({
            query: query,
            timestamp: Date.now()
        });
        
        // Keep only last 20 searches
        if (this.searchHistory.length > 20) {
            this.searchHistory = this.searchHistory.slice(0, 20);
        }
    }
    
    // Load search history
    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('aktubuddy-search-history');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Could not load search history:', error);
        }
    }
    
    // Save search history
    saveSearchHistory() {
        try {
            localStorage.setItem('aktubuddy-search-history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.warn('Could not save search history:', error);
        }
    }
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
            
            // Escape: Clear search
            if (e.key === 'Escape' && document.activeElement && 
                document.activeElement.matches('#searchInput, #mobileSearchInput')) {
                this.clearSearch();
            }
        });
    }
    
    // Setup voice search (if supported)
    setupVoiceSearch() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const query = event.results[0][0].transcript;
                this.handleVoiceSearchResult(query);
            };
            
            this.recognition.onerror = (event) => {
                console.warn('Voice search error:', event.error);
            };
            
            // Add voice search button to search inputs
            this.addVoiceSearchButton();
        }
    }
    
    // Add voice search button
    addVoiceSearchButton() {
        const searchContainers = document.querySelectorAll('.search-box');
        
        searchContainers.forEach(container => {
            const voiceBtn = document.createElement('button');
            voiceBtn.className = 'voice-search-btn';
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.setAttribute('aria-label', 'Voice search');
            voiceBtn.onclick = () => this.startVoiceSearch();
            
            container.appendChild(voiceBtn);
        });
    }
    
    // Start voice search
    startVoiceSearch() {
        if (this.recognition) {
            this.recognition.start();
            // Visual feedback
            const voiceBtns = document.querySelectorAll('.voice-search-btn');
            voiceBtns.forEach(btn => {
                btn.classList.add('listening');
                btn.innerHTML = '<i class="fas fa-microphone-alt"></i>';
            });
        }
    }
    
    // Handle voice search result
    handleVoiceSearchResult(query) {
        // Reset visual feedback
        const voiceBtns = document.querySelectorAll('.voice-search-btn');
        voiceBtns.forEach(btn => {
            btn.classList.remove('listening');
            btn.innerHTML = '<i class="fas fa-microphone"></i>';
        });
        
        // Set search input and perform search
        const searchInputs = document.querySelectorAll('#searchInput, #mobileSearchInput');
        searchInputs.forEach(input => {
            if (input) {
                input.value = query;
            }
        });
        
        this.handleSearch(query);
        
        // Announce result
        if (window.announceToScreenReader) {
            window.announceToScreenReader(`Voice search: ${query}`);
        }
    }
    
    // Focus search input
    focusSearch() {
        const searchInput = document.getElementById('searchInput') || document.getElementById('mobileSearchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Clear search
    clearSearch() {
        const searchInputs = document.querySelectorAll('#searchInput, #mobileSearchInput');
        searchInputs.forEach(input => {
            if (input) {
                input.value = '';
            }
        });
        
        this.currentQuery = '';
        this.hideSearchResults();
    }
    
    // Track search click for analytics
    trackSearchClick(query, url, type) {
        // In a real app, this would send data to analytics service
        console.log('Search click tracked:', { query, url, type });
    }
    
    // Get search suggestions based on history and popular terms
    getSearchSuggestions(query) {
        const suggestions = [];
        
        // Add from search history
        this.searchHistory.forEach(item => {
            if (item.query.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push({
                    text: item.query,
                    type: 'history',
                    icon: 'fas fa-history'
                });
            }
        });
        
        // Add from popular searches
        const popular = this.getPopularSearches();
        popular.forEach(search => {
            if (search.toLowerCase().includes(query.toLowerCase()) &&
                !suggestions.find(s => s.text === search)) {
                suggestions.push({
                    text: search,
                    type: 'popular',
                    icon: 'fas fa-fire'
                });
            }
        });
        
        return suggestions.slice(0, 5);
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aktuBuddySearch = new AKTUBuddySearch();
});

// Export for global access
window.AKTUBuddySearch = AKTUBuddySearch;
