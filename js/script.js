// Function to toggle theme
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    updateThemeToggleIcon();
}

// Function to update theme toggle icon
function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (document.body.classList.contains('dark')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    updateThemeToggleIcon(); // Ensure correct icon on page load
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = mobileMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Populate branch and semester selectors on relevant pages
    const branchSelect = document.getElementById('branchSelect');
    const semesterSelect = document.getElementById('semesterSelect');
    const currentSelectionDiv = document.getElementById('currentSelection');

    if (branchSelect && semesterSelect && currentSelectionDiv) {
        // Load saved selection or default
        const savedBranch = localStorage.getItem('selectedBranch') || 'CSE';
        const savedSemester = localStorage.getItem('selectedSemester') || '1';

        branchSelect.value = savedBranch;
        semesterSelect.value = savedSemester;
        updateCurrentSelection(savedBranch, savedSemester);
        loadContent(savedBranch, savedSemester); // Load initial content based on saved selection

        branchSelect.addEventListener('change', () => {
            const selectedBranch = branchSelect.value;
            const selectedSemester = semesterSelect.value;
            localStorage.setItem('selectedBranch', selectedBranch);
            localStorage.setItem('selectedSemester', selectedSemester);
            updateCurrentSelection(selectedBranch, selectedSemester);
            loadContent(selectedBranch, selectedSemester);
        });

        semesterSelect.addEventListener('change', () => {
            const selectedBranch = branchSelect.value;
            const selectedSemester = semesterSelect.value;
            localStorage.setItem('selectedBranch', selectedBranch);
            localStorage.setItem('selectedSemester', selectedSemester);
            updateCurrentSelection(selectedBranch, selectedSemester);
            loadContent(selectedBranch, selectedSemester);
        });
    } else {
        // For pages without selectors, still attempt to load content if grids exist
        const savedBranch = localStorage.getItem('selectedBranch') || 'CSE';
        const savedSemester = localStorage.getItem('selectedSemester') || '1';
        loadContent(savedBranch, savedSemester);
    }
});

function updateCurrentSelection(branch, semester) {
    const currentSelectionDiv = document.getElementById('currentSelection');
    if (currentSelectionDiv) {
        currentSelectionDiv.textContent = `Currently showing: ${branch} - Semester ${semester}`;
    }
}

// Dummy data for subjects and mock tests (replace with actual data source)
const data = {
    "CSE": {
        "1": {
            subjects: [
                { title: "Engineering Physics", icon: "flask", difficulty: "Easy", mcqs: 120, tests: 5 },
                { title: "Engineering Chemistry", icon: "atom", difficulty: "Medium", mcqs: 100, tests: 4 },
                { title: "Mathematics-I", icon: "calculator", difficulty: "Hard", mcqs: 150, tests: 6, featured: true },
                { title: "Programming for Problem Solving", icon: "code", difficulty: "Medium", mcqs: 180, tests: 7 },
                { title: "Environmental Studies", icon: "leaf", difficulty: "Easy", mcqs: 90, tests: 3 }
            ],
            mockTests: [
                { title: "Physics Semester 1 Mock", questions: 30, duration: 45, type: "MCQ" },
                { title: "Maths-I Full Syllabus Mock", questions: 50, duration: 75, type: "Full" },
                { title: "PPS Unit 1-3 Test", questions: 20, duration: 30, type: "Unit" }
            ]
        },
        "2": {
            subjects: [
                { title: "Engineering Mechanics", icon: "cog", difficulty: "Hard", mcqs: 130, tests: 5 },
                { title: "Basic Electrical Engg.", icon: "bolt", difficulty: "Medium", mcqs: 110, tests: 4 },
                { title: "Mathematics-II", icon: "calculator", difficulty: "Hard", mcqs: 160, tests: 6, featured: true },
                { title: "Data Structure Using C", icon: "network-wired", difficulty: "Hard", mcqs: 200, tests: 8 },
                { title: "Digital Electronics", icon: "microchip", difficulty: "Medium", mcqs: 140, tests: 5 }
            ],
            mockTests: [
                { title: "EM Half Syllabus Mock", questions: 35, duration: 50, type: "MCQ" },
                { title: "DSU Full Test", questions: 60, duration: 90, type: "Full" }
            ]
        }
        // ... more semesters for CSE
    },
    "IT": {
        "1": { /* similar data structure */ },
        "2": { /* similar data structure */ }
    },
    "ECE": {
        "1": { /* similar data structure */ },
        "2": { /* similar data structure */ }
    }
    // ... more branches
};

// Dummy Quiz Questions
const quizQuestions = [
    {
        question: "What is the full form of HTML?",
        options: ["Hyper Text Markup Language", "High-level Text Machine Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
        answer: "Hyper Text Markup Language",
        explanation: "HTML stands for Hyper Text Markup Language. It's the standard markup language for documents designed to be displayed in a web browser."
    },
    {
        question: "Which of the following is used for styling web pages?",
        options: ["HTML", "JavaScript", "CSS", "Python"],
        answer: "CSS",
        explanation: "CSS (Cascading Style Sheets) is used for describing the presentation of a document written in a markup language like HTML."
    },
    {
        question: "Which language is used for web interactivity?",
        options: ["Java", "Python", "JavaScript", "C++"],
        answer: "JavaScript",
        explanation: "JavaScript is a programming language that enables interactive web pages. Many websites use JavaScript for page logic."
    },
    {
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Standard Question Language", "Simple Query Logic", "Sequential Query Library"],
        answer: "Structured Query Language",
        explanation: "SQL (Structured Query Language) is a standard language for storing, manipulating and retrieving data in databases."
    },
    {
        question: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: "Stack",
        explanation: "Stack is a linear data structure that follows the Last In, First Out (LIFO) principle. The last element added is the first one to be removed."
    }
];

let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// Function to load content based on branch and semester
function loadContent(branch, semester) {
    const branchData = data[branch];
    if (!branchData) {
        console.warn(`No data found for branch: ${branch}`);
        document.getElementById('subjectsGrid').innerHTML = '<p>No subjects found for this branch and semester.</p>';
        if (document.getElementById('mockTestsGrid')) {
            document.getElementById('mockTestsGrid').innerHTML = '<p>No mock tests found for this branch and semester.</p>';
        }
        return;
    }

    const semesterData = branchData[semester];
    if (!semesterData) {
        console.warn(`No data found for semester ${semester} in branch ${branch}`);
        document.getElementById('subjectsGrid').innerHTML = '<p>No subjects found for this branch and semester.</p>';
        if (document.getElementById('mockTestsGrid')) {
            document.getElementById('mockTestsGrid').innerHTML = '<p>No mock tests found for this branch and semester.</p>';
        }
        return;
    }

    // Load Subjects (if on subjects.html or index.html)
    const subjectsGrid = document.getElementById('subjectsGrid');
    if (subjectsGrid) {
        subjectsGrid.innerHTML = '';
        semesterData.subjects.forEach(subject => {
            const card = document.createElement('article');
            card.className = `card fade-in ${subject.featured ? 'featured' : ''}`;
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <i class="fas fa-${subject.icon} card-icon"></i>
                        <h3 class="card-title">${subject.title}</h3>
                    </div>
                    <span class="badge badge-${subject.difficulty.toLowerCase()}">${subject.difficulty}</span>
                </div>
                <div class="stats-row">
                    <div class="stat-box">
                        <div class="stat-value">${subject.mcqs}</div>
                        <div class="stat-label">MCQs</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${subject.tests}</div>
                        <div class="stat-label">Tests</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">Topic-wise</div>
                        <div class="stat-label">Practice</div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-small" onclick="startQuiz('${subject.title}')">
                        <i class="fas fa-play"></i> Start Quiz
                    </button>
                    <button class="btn btn-outline btn-small" onclick="viewNotes('${subject.title}')">
                        <i class="fas fa-book"></i> View Notes
                    </button>
                </div>
            `;
            subjectsGrid.appendChild(card);
        });
    }

    // Load Mock Tests (if on mock-tests.html or index.html)
    const mockTestsGrid = document.getElementById('mockTestsGrid');
    if (mockTestsGrid) {
        mockTestsGrid.innerHTML = '';
        semesterData.mockTests.forEach(test => {
            const card = document.createElement('article');
            card.className = 'card fade-in';
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <i class="fas fa-file-invoice card-icon"></i>
                        <h3 class="card-title">${test.title}</h3>
                        <p class="card-subtitle">${test.type} Test</p>
                    </div>
                </div>
                <div class="stats-row">
                    <div class="stat-box">
                        <div class="stat-value">${test.questions}</div>
                        <div class="stat-label">Questions</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${test.duration} min</div>
                        <div class="stat-label">Duration</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">New</div>
                        <div class="stat-label">Status</div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-small" onclick="startMockTest('${test.title}')">
                        <i class="fas fa-play-circle"></i> Start Test
                    </button>
                    <button class="btn btn-outline btn-small">
                        <i class="fas fa-chart-bar"></i> View Report
                    </button>
                </div>
            `;
            mockTestsGrid.appendChild(card);
        });
    }

    // Update total notes count (if on index.html)
    const totalNotesCountElement = document.getElementById('totalNotesCount');
    if (totalNotesCountElement) {
        const totalSubjects = semesterData.subjects.length;
        // Placeholder for actual notes count per subject if available
        totalNotesCountElement.textContent = `${totalSubjects * 10}+`; // Assuming 10 notes per subject for now
    }

    // Update subject progress (if on index.html)
    const subjectProgressList = document.getElementById('subjectProgressList');
    if (subjectProgressList) {
        subjectProgressList.innerHTML = '';
        semesterData.subjects.forEach((subject, index) => {
            // Dummy progress for demonstration
            const progressPercentage = (index + 1) * 10 + 20; // Example: 30%, 40%, 50%...
            const progressDiv = document.createElement('div');
            progressDiv.className = 'subject-progress';
            progressDiv.innerHTML = `
                <div class="subject-header">
                    <span class="subject-name">${subject.title}</span>
                    <span class="subject-score">${progressPercentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
                </div>
                <div class="progress-text">${subject.mcqs} MCQs completed</div>
            `;
            subjectProgressList.appendChild(progressDiv);
        });
    }
}

// Search functionality
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const searchResultsDiv = document.getElementById('searchResults');

function performSearch(query) {
    searchResultsDiv.innerHTML = '';
    searchResultsDiv.style.display = 'none';
    if (query.length < 2) return;

    const currentBranch = localStorage.getItem('selectedBranch') || 'CSE';
    const currentSemester = localStorage.getItem('selectedSemester') || '1';
    const currentSemesterData = data[currentBranch]?.[currentSemester];

    if (!currentSemesterData) return;

    let resultsFound = false;

    // Search subjects
    currentSemesterData.subjects.forEach(subject => {
        if (subject.title.toLowerCase().includes(query.toLowerCase())) {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `<a href="subjects.html#${subject.title.replace(/\s+/g, '-').toLowerCase()}">${subject.title} (Subject)</a>`;
            searchResultsDiv.appendChild(item);
            resultsFound = true;
        }
    });

    // Search mock tests
    currentSemesterData.mockTests.forEach(test => {
        if (test.title.toLowerCase().includes(query.toLowerCase())) {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `<a href="mock-tests.html#${test.title.replace(/\s+/g, '-').toLowerCase()}">${test.title} (Mock Test)</a>`;
            searchResultsDiv.appendChild(item);
            resultsFound = true;
        }
    });

    if (resultsFound) {
        searchResultsDiv.style.display = 'block';
    } else {
        searchResultsDiv.innerHTML = '<div class="search-result-item">No results found.</div>';
        searchResultsDiv.style.display = 'block';
    }
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => performSearch(e.target.value));
}
if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', (e) => performSearch(e.target.value));
}

// Close search results when clicking outside
document.addEventListener('click', (event) => {
    if (searchResultsDiv && !searchResultsDiv.contains(event.target) && event.target !== searchInput && event.target !== mobileSearchInput) {
        searchResultsDiv.style.display = 'none';
    }
});


// Quiz Modal Functions
const quizModal = document.getElementById('quizModal');
const quizModalTitle = document.getElementById('quizModalTitle');
const quizContainer = document.getElementById('quizContainer');
const quizResult = document.getElementById('quizResult');

function startQuiz(subjectTitle) {
    quizModal.classList.add('active');
    quizModalTitle.textContent = `${subjectTitle} Quiz`;
    currentQuizQuestions = quizQuestions; // Using dummy questions for now
    currentQuestionIndex = 0;
    score = 0;
    displayQuestion();
    quizResult.style.display = 'none'; // Hide results from previous quiz
    quizContainer.style.display = 'block'; // Show quiz container
}

function startMockTest(testTitle) {
    // This function can be expanded to load specific mock test questions
    startQuiz(testTitle); // For now, just re-uses the quiz modal
}

function displayQuestion() {
    const question = currentQuizQuestions[currentQuestionIndex];
    if (!question) {
        showQuizResult();
        return;
    }

    quizContainer.innerHTML = `
        <div class="quiz-question">
            <p class="question-text">${currentQuestionIndex + 1}. ${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" data-option="${option}" onclick="selectOption(this)">
                        ${option}
                    </div>
                `).join('')}
            </div>
            <div class="answer-feedback" style="display:none;"></div>
            <button class="btn btn-primary btn-small" style="margin-top:16px;" onclick="checkAnswer()" id="submitAnswerBtn">Submit Answer</button>
            <button class="btn btn-outline btn-small" style="margin-top:16px; display:none;" onclick="nextQuestion()" id="nextQuestionBtn">Next Question <i class="fas fa-arrow-right"></i></button>
            <button class="toggle-explanation" style="display:none;" onclick="toggleExplanation(this)">Show Explanation</button>
            <div class="explanation" style="display:none;">${question.explanation}</div>
        </div>
    `;
    selectedOption = null;
}

function selectOption(element) {
    if (selectedOption) {
        selectedOption.classList.remove('selected'); // If you want to show selection
    }
    selectedOption = element;
    selectedOption.classList.add('selected'); // Add a class for visual feedback
}

function checkAnswer() {
    if (!selectedOption) {
        alert("Please select an option!");
        return;
    }

    const question = currentQuizQuestions[currentQuestionIndex];
    const userAnswer = selectedOption.dataset.option;
    const answerFeedbackDiv = quizContainer.querySelector('.answer-feedback');
    const submitBtn = document.getElementById('submitAnswerBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const toggleExplanationBtn = quizContainer.querySelector('.toggle-explanation');
    const explanationDiv = quizContainer.querySelector('.explanation');
    const options = quizContainer.querySelectorAll('.quiz-option');

    options.forEach(option => option.classList.add('disabled')); // Disable further clicks

    if (userAnswer === question.answer) {
        score++;
        selectedOption.classList.add('correct');
        answerFeedbackDiv.style.display = 'block';
        answerFeedbackDiv.textContent = 'Correct Answer!';
        answerFeedbackDiv.style.backgroundColor = 'var(--correct-green)';
        answerFeedbackDiv.style.color = 'var(--text-light)';
    } else {
        selectedOption.classList.add('incorrect');
        options.forEach(option => {
            if (option.dataset.option === question.answer) {
                option.classList.add('correct'); // Highlight correct answer
            }
        });
        answerFeedbackDiv.style.display = 'block';
        answerFeedbackDiv.textContent = `Incorrect. The correct answer was: ${question.answer}`;
        answerFeedbackDiv.style.backgroundColor = 'var(--incorrect-red)';
        answerFeedbackDiv.style.color = 'var(--text-light)';
    }

    submitBtn.style.display = 'none';
    nextBtn.style.display = 'inline-flex';
    toggleExplanationBtn.style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function showQuizResult() {
    quizContainer.style.display = 'none';
    quizResult.style.display = 'block';
    const percentage = (score / currentQuizQuestions.length) * 100;
    let message = '';
    if (percentage === 100) {
        message = "Excellent! Perfect score!";
    } else if (percentage >= 75) {
        message = "Great job! You're doing well.";
    } else if (percentage >= 50) {
        message = "Good effort! Keep practicing.";
    } else {
        message = "You can do better. Time to review!";
    }

    quizResult.innerHTML = `
        <div class="result-score">${score}/${currentQuizQuestions.length}</div>
        <div class="result-message">${message}</div>
        <button class="btn btn-primary" onclick="closeQuizModal()">Close</button>
        <button class="btn btn-outline" onclick="startQuiz(quizModalTitle.textContent.replace(' Quiz', ''))">Retake Quiz</button>
    `;
}

function closeQuizModal() {
    quizModal.classList.remove('active');
}

function toggleExplanation(button) {
    const explanationDiv = button.nextElementSibling; // The div right after the button
    explanationDiv.classList.toggle('active');
    button.textContent = explanationDiv.classList.contains('active') ? 'Hide Explanation' : 'Show Explanation';
}

// Support Modal Functions
const supportModal = document.getElementById('supportModal');

function openSupportModal() {
    supportModal.classList.add('active');
}

function closeSupportModal() {
    supportModal.classList.remove('active');
}

// Calculator Modal Functions
const calculatorModal = document.getElementById('calculatorModal');
const display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

function openCalculator() {
    calculatorModal.style.display = 'flex';
    display.value = currentInput;
}

function closeCalculator() {
    calculatorModal.style.display = 'none';
    clearAll(); // Reset calculator state on close
}

function appendToDisplay(num) {
    if (waitingForSecondOperand) {
        currentInput = num;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    display.value = currentInput;
}

function setOperator(op) {
    if (firstOperand === null) {
        firstOperand = parseFloat(currentInput);
    } else if (operator) {
        const result = operate(operator, firstOperand, parseFloat(currentInput));
        currentInput = String(result);
        firstOperand = result;
    }
    operator = op;
    waitingForSecondOperand = true;
    display.value = currentInput; // Show the result of previous operation or current input
}

function calculateResult() {
    if (operator === null || waitingForSecondOperand) {
        return;
    }
    const secondOperand = parseFloat(currentInput);
    const result = operate(operator, firstOperand, secondOperand);
    currentInput = String(result);
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '0';
    display.value = currentInput;
}

function clearAll() {
    currentInput = '0';
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    display.value = currentInput;
}

function toggleSign() {
    currentInput = String(parseFloat(currentInput) * -1);
    display.value = currentInput;
}

function calculatePercentage() {
    currentInput = String(parseFloat(currentInput) / 100);
    display.value = currentInput;
}

function calculateSquareRoot() {
    currentInput = String(Math.sqrt(parseFloat(currentInput)));
    display.value = currentInput;
}

function calculatePower(power) {
    currentInput = String(Math.pow(parseFloat(currentInput), power));
    display.value = currentInput;
}

function operate(op, a, b) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) {
                return 'Error'; // Handle division by zero
            }
            return a / b;
        default:
            return b;
    }
}
