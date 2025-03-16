import { Plugin, TFile, Notice } from 'obsidian';
import { ArithmeticGameSettings, DEFAULT_SETTINGS } from './models/settings';
import { Problem, GameResult, Operation } from './models/gameResult';
import { ArithmeticGameView, ARITHMETIC_GAME_VIEW } from './views/gameView';
import { ArithmeticStatsView, ARITHMETIC_STATS_VIEW } from './views/statsView';
import { ArithmeticGameSettingTab } from './settings/settingsTab';

// Main plugin class
export default class ArithmeticGamePlugin extends Plugin {
	settings: ArithmeticGameSettings;

	async onload() {
		await this.loadSettings();

		// Register the custom game view
		this.registerView(
			ARITHMETIC_GAME_VIEW,
			(leaf) => new ArithmeticGameView(leaf, this)
		);

		// Register the custom stats view
		this.registerView(
			ARITHMETIC_STATS_VIEW,
			(leaf) => new ArithmeticStatsView(leaf, this)
		);

		// Add a ribbon icon
		this.addRibbonIcon('calculator', 'Arithmetic Game', () => {
			this.activateView();
		});

		// Add commands
		this.addCommand({
			id: 'open-arithmetic-game',
			name: 'Open Arithmetic Game',
			callback: () => {
				this.activateView();
			}
		});

		this.addCommand({
			id: 'open-arithmetic-stats',
			name: 'Open Arithmetic Game Statistics',
			callback: () => {
				this.activateStatsView();
			}
		});

		this.addCommand({
			id: 'export-arithmetic-results-csv',
			name: 'Export Arithmetic Game Results to CSV',
			callback: () => {
				this.exportResultsCSV();
			}
		});

		// Add settings tab
		this.addSettingTab(new ArithmeticGameSettingTab(this.app, this));

		// Ensure the data directory exists
		this.ensureDataDirectory();
	}

	async ensureDataDirectory() {
		const { vault } = this.app;
		const dirPath = ".arithmetic_game";

		try {
			if (!await vault.adapter.exists(dirPath)) {
				await vault.adapter.mkdir(dirPath);
			}
		} catch (error) {
			console.error('Error creating data directory:', error);
		}
	}

	async activateView() {
		const { workspace } = this.app;

		// Check if view is already open
		let leaf = workspace.getLeavesOfType(ARITHMETIC_GAME_VIEW)[0];

		if (!leaf) {
			// Create a new leaf in the right sidebar and assert it's non-null.
			leaf = workspace.getRightLeaf(false)!;
			await leaf.setViewState({
				type: ARITHMETIC_GAME_VIEW,
				active: true,
			});
		}

		// Reveal the leaf
		workspace.revealLeaf(leaf);
	}

	async activateStatsView() {
		const { workspace } = this.app;

		// Check if view is already open
		let leaf = workspace.getLeavesOfType(ARITHMETIC_STATS_VIEW)[0];

		if (!leaf) {
			// Create a new leaf in the right sidebar and assert it's non-null.
			leaf = workspace.getRightLeaf(false)!;
			await leaf.setViewState({
				type: ARITHMETIC_STATS_VIEW,
				active: true,
			});
		}

		// Reveal the leaf
		workspace.revealLeaf(leaf);
	}

	// Main result saving function - saves both formats
	async saveGameResult(score: number, problemsSolved: number, problems: Problem[]) {
		// Save markdown for Obsidian viewing
		await this.saveMarkdownResults(score, problemsSolved, problems);

		// Save structured data for analysis if enabled
		if (this.settings.saveStructuredData) {
			await this.saveStructuredResults(score, problemsSolved, problems);
		}
	}

	// Original markdown implementation
	async saveMarkdownResults(score: number, problemsSolved: number, problems: Problem[]) {
		const { vault } = this.app;
		const filePath = this.settings.resultsNotePath;

		// Get operations used
		const operationsUsed = [...new Set(problems.map(p => p.operation))];
		const operationsFormatted = operationsUsed.map(op =>
			op.charAt(0).toUpperCase() + op.slice(1)
		).join(', ');

		// Format the date
		const now = new Date();
		const dateString = now.toISOString().split('T')[0];
		const timeString = now.toTimeString().split(' ')[0];

		// Calculate accuracy
		const accuracy = problemsSolved > 0
			? Math.round((score / problemsSolved) * 100)
			: 0;

		// Create content for the new entry
		let newEntry = [
			`## Game on ${dateString} at ${timeString}`,
			`- Score: ${score}`,
			`- Problems solved: ${problemsSolved}`,
			`- Accuracy: ${accuracy}%`,
			`- Operations: ${operationsFormatted}`,
			`- Duration: ${this.settings.gameDuration} seconds`,
			''
		];

		// Add problem history if enabled
		if (this.settings.showHistory && problems.length > 0) {
			newEntry.push('### Problem History');
			problems.forEach((problem, index) => {
				const result = problem.correct ? '✓' : '✗';
				newEntry.push(`${index + 1}. ${problem.text} = ${problem.userAnswer} ${result}${!problem.correct ? ` (Correct: ${problem.answer})` : ''}`);
			});
			newEntry.push('');
		}

		try {
			// Check if the file exists
			const fileExists = await vault.adapter.exists(filePath);

			if (fileExists) {
				// Append to existing file
				const file = vault.getAbstractFileByPath(filePath) as TFile;
				const content = await vault.read(file);
				await vault.modify(file, newEntry.join('\n') + content);
			} else {
				// Create a new file
				const header = '# Arithmetic Game Results\n\n';
				await vault.create(filePath, header + newEntry.join('\n'));
			}
		} catch (error) {
			console.error('Error saving markdown results:', error);
		}
	}

	// Structured data implementation
	async saveStructuredResults(score: number, problemsSolved: number, problems: Problem[]) {
		const { vault } = this.app;
		const jsonFilePath = this.settings.structuredDataPath;

		// Create a structured result object
		const gameResult: GameResult = {
			timestamp: new Date().toISOString(),
			score: score,
			problemsSolved: problemsSolved,
			accuracy: problemsSolved > 0 ? Math.round((score / problemsSolved) * 100) : 0,
			duration: this.settings.gameDuration,
			operations: [...new Set(problems.map(p => p.operation))],
			problems: problems.map(p => ({
				operation: p.operation,
				text: p.text,
				answer: p.answer,
				userAnswer: p.userAnswer,
				correct: p.correct,
				responseTime: p.responseTime
			}))
		};

		try {
			// Ensure directory exists
			await this.ensureDataDirectory();

			// Read existing data or create new array
			let allResults: GameResult[] = [];
			if (await vault.adapter.exists(jsonFilePath)) {
				const content = await vault.adapter.read(jsonFilePath);
				allResults = JSON.parse(content);
			}

			// Add new result and save
			allResults.push(gameResult);
			await vault.adapter.write(jsonFilePath, JSON.stringify(allResults, null, 2));

		} catch (error) {
			console.error('Error saving structured results:', error);
		}
	}

	// Export results to CSV
	async exportResultsCSV() {
		const { vault } = this.app;
		const jsonFilePath = this.settings.structuredDataPath;

		try {
			if (!await vault.adapter.exists(jsonFilePath)) {
				new Notice('No game results found to export.');
				return;
			}

			const content = await vault.adapter.read(jsonFilePath);
			const results: GameResult[] = JSON.parse(content);

			// Create CSV content for games summary
			let gameCsvContent = "timestamp,score,problems_solved,accuracy,duration,operations\n";

			results.forEach((game: GameResult) => {
				gameCsvContent += [
					game.timestamp,
					game.score,
					game.problemsSolved,
					game.accuracy,
					game.duration,
					game.operations.join('|')
				].join(',') + '\n';
			});

			// Create CSV content for problems details
			let problemsCsvContent = "game_timestamp,operation,problem,correct_answer,user_answer,is_correct,response_time\n";

			results.forEach((game: GameResult) => {
				game.problems.forEach((problem: {
					operation: Operation;
					text: string;
					answer: number;
					userAnswer?: number;
					correct?: boolean;
					responseTime?: number;
				}) => {
					problemsCsvContent += [
						game.timestamp,
						problem.operation,
						`"${problem.text}"`, // Quote to handle commas in text
						problem.answer,
						problem.userAnswer || '',
						problem.correct ? 1 : 0,
						problem.responseTime || ''
					].join(',') + '\n';
				});
			});

			// Save game summary CSV
			const summaryPath = "arithmetic_game_summary.csv";
			await vault.adapter.write(summaryPath, gameCsvContent);

			// Save problems detail CSV
			const detailsPath = "arithmetic_game_details.csv";
			await vault.adapter.write(detailsPath, problemsCsvContent);

			new Notice(`Results exported to ${summaryPath} and ${detailsPath}`);
		} catch (error) {
			console.error('Error exporting results:', error);
			new Notice('Error exporting results. See console for details.');
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
