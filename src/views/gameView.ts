import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import ArithmeticGamePlugin from '../main';
import { Problem, Operation } from '../models/gameResult';

// View type constant
export const ARITHMETIC_GAME_VIEW = "arithmetic-game-view";

// Game View
export class ArithmeticGameView extends ItemView {
	plugin: ArithmeticGamePlugin;
	gameContainer: HTMLElement;
	timerInterval: number;
	secsLeft: number;
	score: number;
	problemsSolved: number;
	currentProblem: Problem | null;
	problems: Problem[];
	feedbackMessage: HTMLElement | null;
	lastFeedbackTime: number;
	startProblemTime: number; // Time when current problem was presented

	constructor(leaf: WorkspaceLeaf, plugin: ArithmeticGamePlugin) {
		super(leaf);
		this.plugin = plugin;
		this.problems = [];
		this.feedbackMessage = null;
		this.lastFeedbackTime = 0;
		this.startProblemTime = 0;
	}

	getViewType(): string {
		return ARITHMETIC_GAME_VIEW;
	}

	getDisplayText(): string {
		return "Arithmetic Game";
	}

	getIcon(): string {
		return "calculator";
	}

	// Render the main view
	async onOpen() {
		const { containerEl } = this;
		containerEl.empty();

		// Apply dark mode if enabled
		if (this.plugin.settings.darkMode) {
			containerEl.addClass('arithmetic-game-dark-mode');
		}

		// Add styles
		this.addStyles();

		// Create game container
		this.gameContainer = containerEl.createDiv({ cls: 'arithmetic-game-container' });

		// Render initial screen
		this.renderStartScreen();
	}

	// Add custom styles
	addStyles() {
		const { containerEl } = this;

		// Remove any existing style element
		const existingStyle = containerEl.querySelector('#arithmetic-game-styles');
		if (existingStyle) {
			existingStyle.remove();
		}

		// Create new style element
		const styleEl = containerEl.createEl('style', {
			attr: { id: 'arithmetic-game-styles' }
		});

		styleEl.textContent = `
			.arithmetic-game-container {
				padding: 1rem;
			}
			
			.arithmetic-game-settings-summary {
				background-color: ${this.plugin.settings.darkMode ? '#2d2d2d' : '#f5f5f5'};
				border-radius: 5px;
				padding: 1rem;
				margin-bottom: 1rem;
			}
			
			.game-top-bar {
				display: flex;
				justify-content: space-between;
				margin-bottom: 1rem;
				font-size: 1.1rem;
				font-weight: bold;
			}
			
			.problem-container {
				font-size: 2rem;
				font-weight: bold;
				text-align: center;
				margin: 2rem 0;
			}
			
			.answer-form {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			
			.answer-input {
				font-size: 1.5rem;
				padding: 0.5rem;
				width: 150px;
				text-align: center;
				border-radius: 5px;
				margin-bottom: 1rem;
				transition: border-color 0.3s, box-shadow 0.3s;
			}
			
			.answer-input:focus {
				border-color: #4169e1;
				box-shadow: 0 0 0 2px rgba(65, 105, 225, 0.3);
				outline: none;
			}
			
			.shake-animation {
				animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
				border-color: #c62828 !important;
			}
			
			@keyframes shake {
				10%, 90% { transform: translate3d(-1px, 0, 0); }
				20%, 80% { transform: translate3d(2px, 0, 0); }
				30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
				40%, 60% { transform: translate3d(4px, 0, 0); }
			}
			
			.game-stats {
				margin: 1rem 0;
				padding: 1rem;
				background-color: ${this.plugin.settings.darkMode ? '#2d2d2d' : '#f5f5f5'};
				border-radius: 5px;
			}
			
			.feedback-message {
				text-align: center;
				margin: 1rem 0;
				padding: 0.5rem;
				border-radius: 5px;
				font-weight: bold;
				opacity: 0;
				transition: opacity 0.3s ease;
			}
			
			.feedback-correct {
				background-color: #a3e4a3;
				color: #2e7d32;
			}
			
			.feedback-incorrect {
				background-color: #ffccbc;
				color: #c62828;
			}
			
			.feedback-visible {
				opacity: 1;
			}
			
			.problem-history {
				max-height: 200px;
				overflow-y: auto;
				margin-top: 1rem;
				border: 1px solid #cccccc;
				border-radius: 5px;
				padding: 0.5rem;
			}
			
			.problem-history-item {
				padding: 0.3rem 0;
				border-bottom: 1px solid #e0e0e0;
			}
			
			.problem-history-item:last-child {
				border-bottom: none;
			}
			
			.problem-correct {
				color: #2e7d32;
			}
			
			.problem-incorrect {
				color: #c62828;
			}
			
			.arithmetic-game-dark-mode {
				color: #ffffff;
				background-color: #1e1e1e;
			}
			
			.arithmetic-game-dark-mode .answer-input {
				background-color: #2d2d2d;
				color: #ffffff;
				border: 1px solid #555555;
			}
			
			.operation-toggles {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 1rem;
				margin-bottom: 1rem;
			}
			
			.operation-toggle {
				background-color: ${this.plugin.settings.darkMode ? '#2d2d2d' : '#f5f5f5'};
				padding: 0.5rem;
				border-radius: 5px;
				display: flex;
				align-items: center;
			}
			
			.operation-toggle input[type="checkbox"] {
				margin-right: 0.5rem;
			}
			
			.game-controls {
				display: flex;
				gap: 1rem;
				margin-top: 1rem;
			}
		`;
	}

	// Clean up when view is closed
	async onClose() {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
	}

	// Render the initial start screen
	renderStartScreen() {
		const { gameContainer } = this;
		gameContainer.empty();

		// Create header
		gameContainer.createEl('h2', { text: 'Arithmetic Game' });

		// Create description
		gameContainer.createEl('p', {
			text: 'A fast-paced speed drill where you are given time to solve as many arithmetic problems as you can.'
		});

		// Create settings summary
		const settingsSummary = gameContainer.createDiv({ cls: 'arithmetic-game-settings-summary' });

		// Operation Toggles
		const operationToggles = settingsSummary.createDiv({ cls: 'operation-toggles' });

		// Addition
		const additionToggle = operationToggles.createDiv({ cls: 'operation-toggle' });
		const additionCheckbox = additionToggle.createEl('input', {
			type: 'checkbox',
			attr: {
				id: 'addition-toggle',
				checked: this.plugin.settings.additionEnabled
			}
		});
		additionToggle.createEl('label', {
			text: 'Addition',
			attr: { for: 'addition-toggle' }
		});

		// Subtraction
		const subtractionToggle = operationToggles.createDiv({ cls: 'operation-toggle' });
		const subtractionCheckbox = subtractionToggle.createEl('input', {
			type: 'checkbox',
			attr: {
				id: 'subtraction-toggle',
				checked: this.plugin.settings.subtractionEnabled
			}
		});
		subtractionToggle.createEl('label', {
			text: 'Subtraction',
			attr: { for: 'subtraction-toggle' }
		});

		// Multiplication
		const multiplicationToggle = operationToggles.createDiv({ cls: 'operation-toggle' });
		const multiplicationCheckbox = multiplicationToggle.createEl('input', {
			type: 'checkbox',
			attr: {
				id: 'multiplication-toggle',
				checked: this.plugin.settings.multiplicationEnabled
			}
		});
		multiplicationToggle.createEl('label', {
			text: 'Multiplication',
			attr: { for: 'multiplication-toggle' }
		});

		// Division
		const divisionToggle = operationToggles.createDiv({ cls: 'operation-toggle' });
		const divisionCheckbox = divisionToggle.createEl('input', {
			type: 'checkbox',
			attr: {
				id: 'division-toggle',
				checked: this.plugin.settings.divisionEnabled
			}
		});
		divisionToggle.createEl('label', {
			text: 'Division',
			attr: { for: 'division-toggle' }
		});

		// Update settings when toggled
		additionCheckbox.addEventListener('change', () => {
			this.plugin.settings.additionEnabled = additionCheckbox.checked;
			this.plugin.saveSettings();
		});

		subtractionCheckbox.addEventListener('change', () => {
			this.plugin.settings.subtractionEnabled = subtractionCheckbox.checked;
			this.plugin.saveSettings();
		});

		multiplicationCheckbox.addEventListener('change', () => {
			this.plugin.settings.multiplicationEnabled = multiplicationCheckbox.checked;
			this.plugin.saveSettings();
		});

		divisionCheckbox.addEventListener('change', () => {
			this.plugin.settings.divisionEnabled = divisionCheckbox.checked;
			this.plugin.saveSettings();
		});

		// Duration Selector
		const durationDiv = settingsSummary.createDiv();
		durationDiv.createSpan({ text: 'Duration: ' });

		const durationSelect = durationDiv.createEl('select');
		[30, 60, 120, 180, 300].forEach(seconds => {
			const option = durationSelect.createEl('option', {
				text: seconds === 60 ? '1 minute' :
					seconds === 120 ? '2 minutes' :
						seconds === 180 ? '3 minutes' :
							seconds === 300 ? '5 minutes' :
								`${seconds} seconds`,
				value: seconds.toString()
			});

			if (seconds === this.plugin.settings.gameDuration) {
				option.selected = true;
			}
		});

		durationSelect.addEventListener('change', () => {
			this.plugin.settings.gameDuration = parseInt(durationSelect.value);
			this.plugin.saveSettings();
		});

		// Start button
		const startButton = gameContainer.createEl('button', {
			text: 'Start Game',
			cls: 'mod-cta'
		});

		startButton.addEventListener('click', () => {
			// Ensure at least one operation is enabled
			if (!this.plugin.settings.additionEnabled &&
				!this.plugin.settings.subtractionEnabled &&
				!this.plugin.settings.multiplicationEnabled &&
				!this.plugin.settings.divisionEnabled) {
				// If nothing is enabled, enable addition
				this.plugin.settings.additionEnabled = true;
				this.plugin.saveSettings();
				additionCheckbox.checked = true;
			}

			this.startGame();
		});

		// Add stats button
		const statsButton = gameContainer.createEl('button', {
			text: 'View Statistics',
			cls: 'mod-cta'
		});

		statsButton.addEventListener('click', () => {
			this.plugin.activateStatsView();
		});
	}

	// Start the game
	startGame() {
		// Reset game state
		this.secsLeft = this.plugin.settings.gameDuration;
		this.score = 0;
		this.problemsSolved = 0;
		this.problems = [];
		this.currentProblem = null;

		// Render the game screen
		this.renderGameScreen();

		// Set up the timer
		this.timerInterval = window.setInterval(() => {
			this.secsLeft--;

			// Update the timer display
			const timerEl = this.gameContainer.querySelector('.timer-display');
			if (timerEl) {
				timerEl.textContent = `Seconds left: ${this.secsLeft}`;
			}

			// Check if time is up
			if (this.secsLeft <= 0) {
				this.endGame();
			}
		}, 1000);

		// Create the first problem
		this.createNewProblem();
	}

	// End the game
	endGame() {
		// Clear the timer
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
			this.timerInterval = 0;
		}

		// Save results
		this.plugin.saveGameResult(
			this.score,
			this.problemsSolved,
			this.problems
		);

		// Render the results screen
		this.renderResultsScreen();
	}

	// Render the game screen
	renderGameScreen() {
		const { gameContainer } = this;
		gameContainer.empty();

		// Create the top bar with timer and score
		const topBar = gameContainer.createDiv({ cls: 'game-top-bar' });

		// Timer display
		topBar.createDiv({
			cls: 'timer-display',
			text: `Seconds left: ${this.secsLeft}`
		});

		// Score display
		topBar.createDiv({
			cls: 'score-display',
			text: `Score: ${this.score}`
		});

		// Problem container
		gameContainer.createDiv({ cls: 'problem-container' });

		// Feedback message (if enabled)
		if (this.plugin.settings.showFeedback) {
			this.feedbackMessage = gameContainer.createDiv({
				cls: 'feedback-message'
			});
		}

		// Answer input
		const answerForm = gameContainer.createEl('form', { cls: 'answer-form' });

		const answerInput = answerForm.createEl('input', {
			type: 'number',
			cls: 'answer-input',
			attr: {
				placeholder: 'Enter answer...',
				autocomplete: 'off'
			}
		});

		// Focus the input
		answerInput.focus();

		// Handle input changes (check answer as user types)
		answerInput.addEventListener('input', () => {
			const userAnswer = parseInt(answerInput.value);

			if (isNaN(userAnswer) || !this.currentProblem) {
				return; // Invalid input or no problem
			}

			const isCorrect = userAnswer === this.currentProblem.answer;

			// If correct, auto-proceed
			if (isCorrect) {
				// Calculate response time
				const responseTime = Date.now() - this.startProblemTime;

				// Update score
				this.score++;

				// Update score display
				const scoreDisplay = this.gameContainer.querySelector('.score-display');
				if (scoreDisplay) {
					scoreDisplay.textContent = `Score: ${this.score}`;
				}

				// Update the problem record
				this.currentProblem.userAnswer = userAnswer;
				this.currentProblem.correct = true;
				this.currentProblem.responseTime = responseTime;

				// Show feedback if enabled
				if (this.plugin.settings.showFeedback && this.feedbackMessage) {
					this.feedbackMessage.textContent = 'Correct!';
					this.feedbackMessage.className = 'feedback-message feedback-correct feedback-visible';

					// Clear previous feedback timeout
					if (this.lastFeedbackTime) {
						clearTimeout(this.lastFeedbackTime);
					}

					// Hide feedback after 1.5 seconds
					this.lastFeedbackTime = window.setTimeout(() => {
						if (this.feedbackMessage) {
							this.feedbackMessage.classList.remove('feedback-visible');
						}
					}, 1500);
				}

				// Increment problems solved
				this.problemsSolved++;

				// Clear the input and create a new problem
				answerInput.value = '';
				this.createNewProblem();

				// Focus the input again
				answerInput.focus();
			}
		});

		// Handle form submission (prevent skipping with wrong answers)
		answerForm.addEventListener('submit', (e) => {
			e.preventDefault();

			// Get the user's answer
			const userAnswer = parseInt(answerInput.value);

			if (isNaN(userAnswer) || !this.currentProblem) {
				return; // Invalid input or no problem
			}

			const isCorrect = userAnswer === this.currentProblem.answer;

			// Only allow proceeding if correct
			if (isCorrect) {
				// Already handled by the input event
				return;
			} else {
				// Show feedback that they must enter the correct answer
				if (this.plugin.settings.showFeedback && this.feedbackMessage) {
					this.feedbackMessage.textContent = 'Incorrect. Try again!';
					this.feedbackMessage.className = 'feedback-message feedback-incorrect feedback-visible';

					// Clear previous feedback timeout
					if (this.lastFeedbackTime) {
						clearTimeout(this.lastFeedbackTime);
					}

					// Hide feedback after 1.5 seconds
					this.lastFeedbackTime = window.setTimeout(() => {
						if (this.feedbackMessage) {
							this.feedbackMessage.classList.remove('feedback-visible');
						}
					}, 1500);
				}

				// Don't record wrong answers until user gets it right
				// Don't proceed to next problem

				// Shake the input to indicate error
				answerInput.classList.add('shake-animation');
				setTimeout(() => {
					answerInput.classList.remove('shake-animation');
				}, 500);
			}
		});
	}

	// Create a new arithmetic problem
	createNewProblem() {
		// Record the start time for this problem
		this.startProblemTime = Date.now();

		// Get a list of enabled operations
		const enabledOperations: Operation[] = [];

		if (this.plugin.settings.additionEnabled) enabledOperations.push('addition');
		if (this.plugin.settings.subtractionEnabled) enabledOperations.push('subtraction');
		if (this.plugin.settings.multiplicationEnabled) enabledOperations.push('multiplication');
		if (this.plugin.settings.divisionEnabled) enabledOperations.push('division');

		// Ensure at least one operation is enabled
		if (enabledOperations.length === 0) {
			enabledOperations.push('addition');
		}

		// Randomly select an operation
		let operation: Operation = enabledOperations[Math.floor(Math.random() * enabledOperations.length)] as Operation;

		// Generate the problem based on the operation
		let a: number, b: number, answer: number, text: string;

		switch (operation) {
			case 'addition':
				a = this.getRandomNumber(
					this.plugin.settings.additionMinA,
					this.plugin.settings.additionMaxA
				);
				b = this.getRandomNumber(
					this.plugin.settings.additionMinB,
					this.plugin.settings.additionMaxB
				);
				text = `${a} + ${b}`;
				answer = a + b;
				break;

			case 'subtraction':
				a = this.getRandomNumber(
					this.plugin.settings.subtractionMinA,
					this.plugin.settings.subtractionMaxA
				);
				b = this.getRandomNumber(
					this.plugin.settings.subtractionMinB,
					this.plugin.settings.subtractionMaxB
				);
				// Ensure a ≥ b for positive results
				if (a < b) [a, b] = [b, a];
				text = `${a} - ${b}`;
				answer = a - b;
				break;

			case 'multiplication':
				a = this.getRandomNumber(
					this.plugin.settings.multiplicationMinA,
					this.plugin.settings.multiplicationMaxA
				);
				b = this.getRandomNumber(
					this.plugin.settings.multiplicationMinB,
					this.plugin.settings.multiplicationMaxB
				);
				text = `${a} × ${b}`;
				answer = a * b;
				break;

			case 'division':
				// Start with result and divisor to ensure whole number answers
				const result = this.getRandomNumber(
					this.plugin.settings.divisionMinA,
					this.plugin.settings.divisionMaxA
				);
				b = this.getRandomNumber(
					this.plugin.settings.divisionMinB,
					this.plugin.settings.divisionMaxB
				);
				a = result * b;
				text = `${a} ÷ ${b}`;
				answer = result;
				break;

			default:
				// Fallback to addition (this should not normally happen)
				a = this.getRandomNumber(1, 10);
				b = this.getRandomNumber(1, 10);
				text = `${a} + ${b}`;
				answer = a + b;
				operation = 'addition';
		}

		// Create problem object
		this.currentProblem = {
			a, b, operation, answer, text
		};

		// Add to problems array
		this.problems.push(this.currentProblem);

		// Update the problem display
		const problemContainer = this.gameContainer.querySelector('.problem-container');
		if (problemContainer) {
			problemContainer.textContent = `${text} = ?`;
		}
	}

	// Get a random number within a range
	getRandomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Render the results screen
	renderResultsScreen() {
		const { gameContainer } = this;
		gameContainer.empty();

		gameContainer.createEl('h2', { text: 'Game Over!' });
		gameContainer.createEl('h3', { text: `Final Score: ${this.score}` });

		// Calculate accuracy
		const accuracy = this.problemsSolved > 0
			? Math.round((this.score / this.problemsSolved) * 100)
			: 0;

		// Get operations used
		const operationsUsed = [...new Set(this.problems.map(p => p.operation))];
		const operationsFormatted = operationsUsed.map(op =>
			op.charAt(0).toUpperCase() + op.slice(1)
		).join(', ');

		const statsDiv = gameContainer.createDiv({ cls: 'game-stats' });
		statsDiv.createEl('p', { text: `Problems solved: ${this.problemsSolved}` });
		statsDiv.createEl('p', { text: `Accuracy: ${accuracy}%` });
		statsDiv.createEl('p', { text: `Operations used: ${operationsFormatted}` });
		statsDiv.createEl('p', {
			text: `Results saved to: ${this.plugin.settings.resultsNotePath}`
		});

		// Show problem history if enabled
		if (this.plugin.settings.showHistory && this.problems.length > 0) {
			const historyDiv = gameContainer.createDiv();
			historyDiv.createEl('h4', { text: 'Problem History' });

			const historyList = historyDiv.createDiv({ cls: 'problem-history' });

			this.problems.forEach((problem, index) => {
				const historyItem = historyList.createDiv({
					cls: `problem-history-item ${problem.correct ? 'problem-correct' : 'problem-incorrect'}`
				});

				historyItem.createSpan({
					text: `${index + 1}. ${problem.text} = ${problem.userAnswer} `
				});

				historyItem.createSpan({
					text: problem.correct ? '✓' : `✗ (${problem.answer})`
				});

				// Add response time if available
				if (problem.responseTime) {
					historyItem.createSpan({
						text: ` - ${(problem.responseTime / 1000).toFixed(1)}s`
					});
				}
			});
		}

		// Game control buttons
		const controlsDiv = gameContainer.createDiv({ cls: 'game-controls' });

		const playAgainButton = controlsDiv.createEl('button', {
			text: 'Play Again',
			cls: 'mod-cta'
		});
		playAgainButton.addEventListener('click', () => {
			this.startGame();
		});

		const startScreenButton = controlsDiv.createEl('button', {
			text: 'Return to Start'
		});
		startScreenButton.addEventListener('click', () => {
			this.renderStartScreen();
		});

		const viewStatsButton = controlsDiv.createEl('button', {
			text: 'View Statistics'
		});
		viewStatsButton.addEventListener('click', () => {
			this.plugin.activateStatsView();
		});
	}
}
