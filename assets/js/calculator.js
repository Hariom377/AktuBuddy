/* ====================================
   AKTUBUDDY - SCIENTIFIC CALCULATOR
   Calculator logic and UI management
   ==================================== */

class Calculator {
  constructor(options) {
    this.display = document.getElementById(options.displayId);
    this.buttonsContainer = document.getElementById(options.buttonsContainerId);
    this.memory = 0;
    this.expression = '';
    this.resultDisplayed = false;
    this.init();
  }

  init() {
    if (!this.buttonsContainer || !this.display) return;

    this.buttonsContainer.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'button') {
        this.handleButtonPress(e.target.dataset.value);
      }
    });

    document.addEventListener('keydown', (e) => {
      this.handleKeyPress(e);
    });

    this.updateDisplay('0');
  }

  handleButtonPress(value) {
    if (value === undefined) return;

    switch (value) {
      case 'C':
        this.clear();
        break;
      case 'CE':
        this.clearEntry();
        break;
      case '=':
        this.evaluate();
        break;
      case 'MC':
        this.memoryClear();
        break;
      case 'MR':
        this.memoryRecall();
        break;
      case 'M+':
        this.memoryAdd();
        break;
      case 'M-':
        this.memorySubtract();
        break;
      default:
        this.appendValue(value);
        break;
    }
  }

  handleKeyPress(e) {
    const validKeys = '0123456789+-*/().';
    if (validKeys.includes(e.key)) {
      e.preventDefault();
      this.appendValue(e.key);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.evaluate();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      this.backspace();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.clear();
    }
  }

  appendValue(value) {
    if (this.resultDisplayed) {
      if ('0123456789.'.includes(value)) {
        this.expression = '';
      }
      this.resultDisplayed = false;
    }

    // Prevent multiple operators and invalid expressions
    if (/[+\-*/.]$/.test(this.expression) && /[+\-*/.]/.test(value)) {
      this.expression = this.expression.slice(0, -1);
    }

    this.expression += value;
    this.updateDisplay(this.expression);
  }

  clear() {
    this.expression = '';
    this.updateDisplay('0');
  }

  clearEntry() {
    this.expression = this.expression.slice(0, -1);
    this.updateDisplay(this.expression || '0');
  }

  backspace() {
    this.clearEntry();
  }

  memoryClear() {
    this.memory = 0;
    this.showTemporaryMessage('Memory cleared');
  }

  memoryRecall() {
    this.appendValue(this.memory.toString());
    this.showTemporaryMessage(`Memory recall: ${this.memory}`);
  }

  memoryAdd() {
    try {
      const val = this.safeEvaluate(this.expression);
      this.memory += val;
      this.showTemporaryMessage(`Added to memory: ${val}`);
    } catch {
      this.showTemporaryMessage('Invalid expression');
    }
  }

  memorySubtract() {
    try {
      const val = this.safeEvaluate(this.expression);
      this.memory -= val;
      this.showTemporaryMessage(`Subtracted from memory: ${val}`);
    } catch {
      this.showTemporaryMessage('Invalid expression');
    }
  }

  evaluate() {
    try {
      const result = this.safeEvaluate(this.expression);
      this.updateDisplay(result.toString());
      this.expression = result.toString();
      this.resultDisplayed = true;
    } catch {
      this.updateDisplay('Error');
      this.resultDisplayed = true;
    }
  }

  
  safeEvaluate(expr) {
    // Simple safe eval: restrict to digits, operators, decimal, parentheses
    if (/[^0-9+\-*/(). ]/.test(expr)) {
      throw new Error('Invalid characters');
    }
    // eslint-disable-next-line no-new-func
    return Function(`"use strict";return (${expr})`)();
  }

  updateDisplay(value) {
    if (this.display) {
      this.display.textContent = value;
    }
  }

  showTemporaryMessage(message) {
    // Optional: Show a temporary message on calculator UI
    console.log(message);
  }
}

// Usage:
// const calculator = new Calculator({displayId: 'display', buttonsContainerId: 'calculatorButtons'});
// calculator.init();

// Export globally
window.Calculator = Calculator;
