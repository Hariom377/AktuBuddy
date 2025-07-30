/* ====================================
   AKTUBUDDY - QUIZ ENGINE
   MCQ quiz logic, state management, and UI handling
   ==================================== */

class QuizEngine {
  constructor(options) {
    this.quizContainer = document.getElementById(options.quizContainerId);
    this.questions = options.questions || [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.onQuizComplete = options.onQuizComplete || function () {};
    this.shuffle = options.shuffle || false;
    this.timerDuration = options.timerDuration || null; // in seconds
    this.timerInterval = null;
    this.timeLeft = this.timerDuration;
  }

  start() {
    // Shuffle questions if enabled
    if (this.shuffle) {
      this.questions = this.shuffleArray(this.questions);
    }
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeLeft = this.timerDuration;

    this.renderQuestion();
    if (this.timerDuration) {
      this.startTimer();
    }
  }

  shuffleArray(arr) {
    let array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  renderQuestion() {
    if (!this.quizContainer) return;
    const questionObj = this.questions[this.currentQuestionIndex];
    if (!questionObj) return;

    // Build HTML for question and options
    let html = `<div class="quiz-question">
                  <div class="question-text">${this.escapeHTML(questionObj.question)}</div>
                </div>
                <div class="quiz-options">`;

    questionObj.options.forEach((option, index) => {
      html += `
        <button class="quiz-option" data-index="${index}" type="button" aria-label="Option ${index + 1}: ${this.escapeHTML(option)}">
          ${this.escapeHTML(option)}
        </button>`;
    });

    html += `</div>
             <div class="quiz-feedback" aria-live="polite" aria-atomic="true"></div>
             <div class="quiz-navigation">
               ${this.currentQuestionIndex > 0 ? '<button id="prevQuestion" class="btn btn-small">Previous</button>' : ''}
               <button id="nextQuestion" class="btn btn-small">${this.currentQuestionIndex === this.questions.length -1 ? 'Finish' : 'Next'}</button>
             </div>`;

    this.quizContainer.innerHTML = html;

    // Add event listeners for options and navigation
    this.quizContainer.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleOptionClick(e));
    });

    const nextBtn = this.quizContainer.querySelector('#nextQuestion');
    if (nextBtn) {
      nextBtn.disabled = true; // disable until user selects answer
      nextBtn.addEventListener('click', () => this.handleNext());
    }

    const prevBtn = this.quizContainer.querySelector('#prevQuestion');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.handlePrevious());
    }

    // If user previously answered this question, show selection and feedback
    if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
      this.provideFeedback(this.userAnswers[this.currentQuestionIndex], false);
    }
  }

  handleOptionClick(event) {
    if (!event.target.classList.contains('quiz-option')) return;

    const selectedIdx = parseInt(event.target.getAttribute('data-index'), 10);
    this.userAnswers[this.currentQuestionIndex] = selectedIdx;

    this.provideFeedback(selectedIdx, true);
  }

  provideFeedback(selectedIdx, enableNext) {
    const questionObj = this.questions[this.currentQuestionIndex];
    if (!questionObj) return;

    const options = this.quizContainer.querySelectorAll('.quiz-option');
    options.forEach((btn, idx) => {
      btn.disabled = true;
      btn.classList.remove('correct', 'incorrect');
      if (idx === questionObj.correct) btn.classList.add('correct');
      if (idx === selectedIdx && idx !== questionObj.correct) btn.classList.add('incorrect');
    });

    const feedback = this.quizContainer.querySelector('.quiz-feedback');
    if (feedback) {
      if (selectedIdx === questionObj.correct) {
        feedback.textContent = `Correct! ${questionObj.explanation || ''}`;
        this.score++;
      } else {
        feedback.textContent = `Incorrect. ${questionObj.explanation || ''}`;
      }
    }

    if (enableNext) {
      const nextBtn = this.quizContainer.querySelector('#nextQuestion');
      if (nextBtn) nextBtn.disabled = false;
    }
  }

  handleNext() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderQuestion();
    } else {
      this.finishQuiz();
    }
  }

  handlePrevious() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderQuestion();
    }
  }

  finishQuiz() {
    clearInterval(this.timerInterval);

    const resultHtml = `
      <div class="quiz-result">
        <div class="result-score">Score: ${this.score} / ${this.questions.length}</div>
        <div class="result-message">${this.getResultMessage()}</div>
        <button id="restartQuiz" class="btn btn-primary">Restart Quiz</button>
      </div>`;
    this.quizContainer.innerHTML = resultHtml;

    const restartBtn = document.getElementById('restartQuiz');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.start();
      });
    }

    this.onQuizComplete(this.score, this.questions.length);
  }

  getResultMessage() {
    const percent = (this.score / this.questions.length) * 100;
    if (percent >= 90) return "Excellent work!";
    if (percent >= 75) return "Good job!";
    if (percent >= 50) return "Fair effort. Keep practicing!";
    return "Needs improvement. Don't give up!";
  }

  startTimer() {
    if (!this.timerDuration) return;
    this.timeLeft = this.timerDuration;
    const timerEl = document.createElement('div');
    timerEl.className = 'quiz-timer';
    this.quizContainer.prepend(timerEl);

    this.updateTimerDisplay(timerEl);

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay(timerEl);

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.finishQuiz();
      }
    }, 1000);
  }

  updateTimerDisplay(timerEl) {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    timerEl.textContent = `Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  escapeHTML(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', '\'':'&#39;'}[m];
    });
  }
}

// Usage:
// const quiz = new QuizEngine({
//   quizContainerId: 'quizContent',
//   questions: [...], // array of question objects
//   onQuizComplete: (score, total) => {console.log(`Quiz done: ${score} out of ${total}`);},
//   shuffle: true,
//   timerDuration: 600 // 10 minutes
// });
// quiz.start();

// Export globally
window.QuizEngine = QuizEngine;
