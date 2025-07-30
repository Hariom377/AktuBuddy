/* ====================================
   AKTUBUDDY - PROGRESS TRACKER
   Tracks user study progress and displays statistics
   ==================================== */

class ProgressTracker {
  constructor(options) {
    this.container = document.getElementById(options.containerId);
    this.progressData = options.progressData || [];
    this.loadProgress();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('aktubuddy-progress');
      if (saved) {
        this.progressData = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load progress:', e);
    }
  }

  saveProgress() {
    try {
      localStorage.setItem('aktubuddy-progress', JSON.stringify(this.progressData));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }

  updateSubjectProgress(subjectCode, completed, total, score) {
    let subject = this.progressData.find(p => p.subjectCode === subjectCode);
    if (!subject) {
      subject = { subjectCode, completed: 0, total: 0, score: 0 };
      this.progressData.push(subject);
    }
    subject.completed = completed;
    subject.total = total;
    subject.score = score;
    this.saveProgress();
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = '';

    if (this.progressData.length === 0) {
      this.container.innerHTML = `<p>No progress data available. Start practicing quizzes!</p>`;
      return;
    }

    this.progressData.forEach(subject => {
      const percent = subject.total > 0 ? ((subject.completed / subject.total) * 100).toFixed(1) : 0;

      const card = document.createElement('article');
      card.className = 'progress-card';

      card.innerHTML = `
        <h3>${this.escapeHTML(subject.subjectCode)}</h3>
        <div class="progress">
          <div class="progress-fill" style="width: ${percent}%;"></div>
        </div>
        <div class="progress-text">${percent}% Completed, Score: ${subject.score}%</div>
      `;

      this.container.appendChild(card);
    });
  }

  escapeHTML(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', '\'':'&#39;'}[m];
    });
  }
}

// Usage example:
// const tracker = new ProgressTracker({containerId: 'subjectProgressList'});
// tracker.render();

// Export globally
window.ProgressTracker = ProgressTracker;
