import { ItemView, WorkspaceLeaf } from 'obsidian';
import ArithmeticGamePlugin from '../main';
import { GameResult, Operation } from '../models/gameResult';

// View type constant
export const ARITHMETIC_STATS_VIEW = "arithmetic-game-stats-view";

// Statistics View
export class ArithmeticStatsView extends ItemView {
	plugin: ArithmeticGamePlugin;

	constructor(leaf: WorkspaceLeaf, plugin: ArithmeticGamePlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return ARITHMETIC_STATS_VIEW;
	}

	getDisplayText(): string {
		return "Arithmetic Game Statistics";
	}

	getIcon(): string {
		return "bar-chart-2";
	}

	async onOpen() {
		const { containerEl } = this;
		containerEl.empty();

		// Apply dark mode if enabled
		if (this.plugin.settings.darkMode) {
			containerEl.addClass('arithmetic-game-dark-mode');
		}

		// Add custom stats styles
		this.addStatsStyles();

		// Create header with title and export button
		const headerDiv = containerEl.createDiv({ cls: 'stats-header' });
		headerDiv.createEl('h2', { text: 'Arithmetic Game Statistics' });

		const exportButton = headerDiv.createEl('button', {
			text: 'Export Data',
			cls: 'stats-export-button'
		});
		exportButton.addEventListener('click', () => {
			this.plugin.exportResultsCSV();
		});

		try {
			// Load the structured data
			const { vault } = this.plugin.app;
			const jsonFilePath = this.plugin.settings.structuredDataPath;

			if (await vault.adapter.exists(jsonFilePath)) {
				const content = await vault.adapter.read(jsonFilePath);
				const results: GameResult[] = JSON.parse(content);

				// Check if there are any results
				if (results.length === 0) {
					this.renderNoDataMessage();
					return;
				}

				// Render statistics
				await this.renderStatistics(results);
			} else {
				this.renderNoDataMessage();
			}
		} catch (error) {
			console.error('Error loading statistics:', error);
			containerEl.createEl('div', {
				cls: 'stats-error-message',
				text: 'Error loading statistics. Please try again.'
			});
		}
	}

	addStatsStyles() {
		const { containerEl } = this;

		// Remove any existing style element
		const existingStyle = containerEl.querySelector('#arithmetic-stats-styles');
		if (existingStyle) {
			existingStyle.remove();
		}

		// Create new style element
		const styleEl = containerEl.createEl('style', {
			attr: { id: 'arithmetic-stats-styles' }
		});

		const isDarkMode = this.plugin.settings.darkMode;
		const baseColor = isDarkMode ? '#4169e1' : '#4169e1';
		const backgroundColor = isDarkMode ? '#1e1e1e' : '#ffffff';
		const cardBgColor = isDarkMode ? '#2d2d2d' : '#f5f5f5';
		const textColor = isDarkMode ? '#ffffff' : '#333333';
		const borderColor = isDarkMode ? '#555555' : '#dddddd';
		const hoverColor = isDarkMode ? '#3a3a3a' : '#e9e9e9';

		styleEl.textContent = `
            .stats-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid ${borderColor};
            }
            
            .stats-header h2 {
                margin: 0;
            }
            
            .stats-export-button {
                background-color: ${baseColor};
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s ease;
            }
            
            .stats-export-button:hover {
                background-color: ${isDarkMode ? '#5178e3' : '#3158d0'};
            }
            
            .stats-dashboard {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            
            .stats-card {
                background-color: ${cardBgColor};
                border-radius: 8px;
                padding: 16px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .stats-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            
            .stats-card-title {
                font-size: 0.9em;
                color: ${isDarkMode ? '#aaaaaa' : '#666666'};
                margin-bottom: 8px;
            }
            
            .stats-card-value {
                font-size: 1.8em;
                font-weight: bold;
                color: ${baseColor};
            }
            
            .stats-card-secondary {
                font-size: 0.85em;
                color: ${isDarkMode ? '#bbbbbb' : '#777777'};
                margin-top: 4px;
            }
            
            .stats-section {
                margin: 24px 0;
            }
            
            .stats-section-header {
                font-size: 1.2em;
                margin-bottom: 16px;
                padding-bottom: 8px;
                border-bottom: 1px solid ${borderColor};
            }
            
            .stats-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .stats-table th {
                background-color: ${isDarkMode ? '#333333' : '#f0f0f0'};
                padding: 12px 16px;
                text-align: left;
                font-weight: 600;
            }
            
            .stats-table td {
                padding: 12px 16px;
                border-top: 1px solid ${borderColor};
            }
            
            .stats-table tr:nth-child(even) {
                background-color: ${isDarkMode ? '#292929' : '#fafafa'};
            }
            
            .stats-table tr:hover {
                background-color: ${hoverColor};
            }
            
            .performance-indicator {
                width: 100%;
                height: 8px;
                background-color: ${isDarkMode ? '#444444' : '#e0e0e0'};
                border-radius: 4px;
                overflow: hidden;
                margin-top: 4px;
            }
            
            .performance-bar {
                height: 100%;
                background-color: ${baseColor};
                border-radius: 4px;
            }
            
            .stats-chart-container {
                height: 250px;
                margin: 20px 0;
                padding: 16px;
                background-color: ${cardBgColor};
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .stats-filter-bar {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
                padding: 12px;
                background-color: ${cardBgColor};
                border-radius: 8px;
                flex-wrap: wrap;
            }
            
            .stats-filter-item {
                display: flex;
                flex-direction: column;
            }
            
            .stats-filter-label {
                font-size: 0.85em;
                margin-bottom: 4px;
                color: ${isDarkMode ? '#aaaaaa' : '#666666'};
            }
            
            .stats-filter-select {
                padding: 6px 10px;
                border-radius: 4px;
                border: 1px solid ${borderColor};
                background-color: ${backgroundColor};
                color: ${textColor};
            }
            
            .stats-tabs {
                display: flex;
                border-bottom: 1px solid ${borderColor};
                margin-bottom: 16px;
            }
            
            .stats-tab {
                padding: 8px 16px;
                cursor: pointer;
                border-bottom: 3px solid transparent;
            }
            
            .stats-tab.active {
                border-bottom-color: ${baseColor};
                font-weight: 600;
            }
            
            .stats-no-data {
                text-align: center;
                padding: 48px 0;
                color: ${isDarkMode ? '#aaaaaa' : '#666666'};
            }
            
            .stats-no-data h3 {
                margin-bottom: 12px;
                color: ${textColor};
            }
            
            .stats-error-message {
                color: #e53935;
                padding: 12px;
                background-color: ${isDarkMode ? '#2a2222' : '#ffebee'};
                border-radius: 4px;
                margin: 20px 0;
            }
            
            .trend-positive {
                color: #4caf50;
            }
            
            .trend-negative {
                color: #f44336;
            }
            
            /* Create mock "chart" elements since we can't render real ones */
            .chart-bar {
                height: 20px;
                background-color: ${baseColor};
                margin-bottom: 4px;
                border-radius: 2px;
            }
        `;
	}

	renderNoDataMessage() {
		const { containerEl } = this;

		const noDataDiv = containerEl.createDiv({ cls: 'stats-no-data' });
		noDataDiv.createEl('h3', { text: 'No Game Data Available' });
		noDataDiv.createEl('p', {
			text: 'Play a few games to see your statistics and performance trends here.'
		});

		const startGameBtn = noDataDiv.createEl('button', {
			text: 'Start a Game',
			cls: 'stats-export-button'
		});

		startGameBtn.addEventListener('click', () => {
			this.plugin.activateView();
		});
	}

	async renderStatistics(results: GameResult[]) {
		const { containerEl } = this;

		// Add tabs for different views
		const tabsDiv = containerEl.createDiv({ cls: 'stats-tabs' });
		const overviewTab = tabsDiv.createDiv({
			cls: 'stats-tab active',
			text: 'Overview'
		});
		const historyTab = tabsDiv.createDiv({
			cls: 'stats-tab',
			text: 'Game History'
		});
		const operationsTab = tabsDiv.createDiv({
			cls: 'stats-tab',
			text: 'Operations'
		});

		// Create tab content container
		const tabContentDiv = containerEl.createDiv();

		// Setup tab switching
		const tabs = [overviewTab, historyTab, operationsTab];
		const renderFunctions = [
			() => this.renderOverviewTab(results, tabContentDiv),
			() => this.renderHistoryTab(results, tabContentDiv),
			() => this.renderOperationsTab(results, tabContentDiv)
		];

		tabs.forEach((tab, index) => {
			tab.addEventListener('click', () => {
				tabs.forEach(t => t.classList.remove('active'));
				tab.classList.add('active');
				tabContentDiv.empty();
				renderFunctions[index]();
			});
		});

		// Render the default (overview) tab
		this.renderOverviewTab(results, tabContentDiv);
	}

	renderOverviewTab(results: GameResult[], containerEl: HTMLElement) {
		// Dashboard - Key metrics in cards
		const dashboardDiv = containerEl.createDiv({ cls: 'stats-dashboard' });

		// Calculate metrics
		const totalGames = results.length;
		const totalProblems = results.reduce((sum, game) => sum + game.problemsSolved, 0);
		const avgScore = results.reduce((sum, game) => sum + game.score, 0) / totalGames;
		const avgAccuracy = results.reduce((sum, game) => sum + game.accuracy, 0) / totalGames;

		// Best game
		const bestGame = results.reduce((best, game) =>
			game.score > best.score ? game : best, results[0]);

		// Last 5 games for trend analysis
		const recentGames = [...results]
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
			.slice(0, 5);

		const recentAvgScore = recentGames.reduce((sum, game) => sum + game.score, 0) / recentGames.length;
		const scoreTrend = recentAvgScore > avgScore ? 'positive' : 'negative';

		// Create metric cards
		this.createMetricCard(dashboardDiv, 'Total Games', totalGames);
		this.createMetricCard(dashboardDiv, 'Total Problems Solved', totalProblems);
		this.createMetricCard(
			dashboardDiv,
			'Average Score',
			avgScore.toFixed(1),
			`Recent trend: <span class="trend-${scoreTrend}">${scoreTrend === 'positive' ? '↑' : '↓'} ${recentAvgScore.toFixed(1)}</span>`
		);
		this.createMetricCard(dashboardDiv, 'Average Accuracy', `${avgAccuracy.toFixed(1)}%`);

		// Create a visual representation of recent performance
		const performanceDiv = containerEl.createDiv({ cls: 'stats-section' });
		performanceDiv.createEl('h3', {
			cls: 'stats-section-header',
			text: 'Recent Performance'
		});

		// Mock chart representation
		const chartContainer = performanceDiv.createDiv({ cls: 'stats-chart-container' });

		// Create 5 bars with different heights to simulate a chart
		const lastGames = [...results]
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
			.slice(0, 10);

		const maxScore = Math.max(...lastGames.map(g => g.score));

		lastGames.forEach(game => {
			const percentage = (game.score / maxScore) * 100;
			const barDiv = chartContainer.createDiv({ cls: 'chart-bar' });
			barDiv.style.width = `${percentage}%`;
			barDiv.title = `Score: ${game.score} on ${new Date(game.timestamp).toLocaleDateString()}`;
		});

		chartContainer.createEl('div', {
			cls: 'stats-card-secondary',
			text: 'Chart: Your last 10 game scores'
		});

		// Best Game Highlight
		const bestGameDiv = containerEl.createDiv({ cls: 'stats-section' });
		bestGameDiv.createEl('h3', {
			cls: 'stats-section-header',
			text: 'Best Performance'
		});

		const bestGameCard = bestGameDiv.createDiv({ cls: 'stats-card' });
		bestGameCard.createEl('div', {
			cls: 'stats-card-title',
			text: 'Highest Score'
		});
		bestGameCard.createEl('div', {
			cls: 'stats-card-value',
			text: `${bestGame.score} points`
		});
		bestGameCard.createEl('div', {
			cls: 'stats-card-secondary',
			text: `Achieved on ${new Date(bestGame.timestamp).toLocaleString()} with ${bestGame.accuracy}% accuracy`
		});
	}

	renderHistoryTab(results: GameResult[], containerEl: HTMLElement) {
		// Add filters bar
		const filtersDiv = containerEl.createDiv({ cls: 'stats-filter-bar' });

		// Sort filter
		const sortFilterDiv = filtersDiv.createDiv({ cls: 'stats-filter-item' });
		sortFilterDiv.createEl('div', {
			cls: 'stats-filter-label',
			text: 'Sort by'
		});
		const sortSelect = sortFilterDiv.createEl('select', { cls: 'stats-filter-select' });
		sortSelect.createEl('option', { text: 'Date (newest first)', value: 'date-desc' });
		sortSelect.createEl('option', { text: 'Date (oldest first)', value: 'date-asc' });
		sortSelect.createEl('option', { text: 'Score (highest first)', value: 'score-desc' });
		sortSelect.createEl('option', { text: 'Score (lowest first)', value: 'score-asc' });

		// Operation filter
		const opFilterDiv = filtersDiv.createDiv({ cls: 'stats-filter-item' });
		opFilterDiv.createEl('div', {
			cls: 'stats-filter-label',
			text: 'Operation'
		});
		const opSelect = opFilterDiv.createEl('select', { cls: 'stats-filter-select' });
		opSelect.createEl('option', { text: 'All Operations', value: 'all' });
		opSelect.createEl('option', { text: 'Addition', value: 'addition' });
		opSelect.createEl('option', { text: 'Subtraction', value: 'subtraction' });
		opSelect.createEl('option', { text: 'Multiplication', value: 'multiplication' });
		opSelect.createEl('option', { text: 'Division', value: 'division' });

		// Create table container
		const tableContainer = containerEl.createDiv();

		// Function to render the table with current filters
		const renderTable = () => {
			tableContainer.empty();

			let filteredResults = [...results];

			// Apply operation filter
			if (opSelect.value !== 'all') {
				filteredResults = filteredResults.filter(game =>
					game.operations.includes(opSelect.value as Operation)
				);
			}

			// Apply sort
			switch(sortSelect.value) {
				case 'date-asc':
					filteredResults.sort((a, b) =>
						new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
					);
					break;
				case 'date-desc':
					filteredResults.sort((a, b) =>
						new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
					);
					break;
				case 'score-desc':
					filteredResults.sort((a, b) => b.score - a.score);
					break;
				case 'score-asc':
					filteredResults.sort((a, b) => a.score - b.score);
					break;
			}

			// Create table
			const table = tableContainer.createEl('table', { cls: 'stats-table' });

			// Table header
			const thead = table.createEl('thead');
			const headerRow = thead.createEl('tr');
			headerRow.createEl('th', { text: 'Date & Time' });
			headerRow.createEl('th', { text: 'Score' });
			headerRow.createEl('th', { text: 'Problems' });
			headerRow.createEl('th', { text: 'Accuracy' });
			headerRow.createEl('th', { text: 'Operations' });
			headerRow.createEl('th', { text: 'Time (sec)' });

			// Table body
			const tbody = table.createEl('tbody');

			filteredResults.forEach(game => {
				const row = tbody.createEl('tr');

				// Date & Time
				row.createEl('td', {
					text: new Date(game.timestamp).toLocaleString()
				});

				// Score
				row.createEl('td', { text: game.score.toString() });

				// Problems
				row.createEl('td', { text: game.problemsSolved.toString() });

				// Accuracy
				const accuracyCell = row.createEl('td');
				accuracyCell.createEl('div', { text: `${game.accuracy}%` });

				const indicatorDiv = accuracyCell.createDiv({ cls: 'performance-indicator' });
				indicatorDiv.createDiv({
					cls: 'performance-bar',
					attr: { style: `width: ${game.accuracy}%` }
				});

				// Operations
				row.createEl('td', {
					text: game.operations
						.map(op => op.charAt(0).toUpperCase() + op.slice(1))
						.join(', ')
				});

				// Duration
				row.createEl('td', { text: game.duration.toString() });
			});
		};

		// Initial render
		renderTable();

		// Add event listeners for filters
		sortSelect.addEventListener('change', renderTable);
		opSelect.addEventListener('change', renderTable);
	}

	renderOperationsTab(results: GameResult[], containerEl: HTMLElement) {
		// Collect all problems from all games
		const allProblems = results.flatMap(game => game.problems);

		// Group by operation
		const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];

		// Create operation cards
		const operationsDiv = containerEl.createDiv({ cls: 'stats-dashboard' });

		operations.forEach(operation => {
			const operationProblems = allProblems.filter(p => p.operation === operation);

			if (operationProblems.length === 0) return;

			const correctProblems = operationProblems.filter(p => p.correct);
			const accuracy = (correctProblems.length / operationProblems.length) * 100;

			// Calculate average response time
			const problemsWithTime = operationProblems.filter(p => p.responseTime);
			const avgTime = problemsWithTime.length > 0
				? problemsWithTime.reduce((sum, p) => sum + (p.responseTime || 0), 0) / problemsWithTime.length / 1000
				: 0;

			const card = operationsDiv.createDiv({ cls: 'stats-card' });

			// Title with capitalized operation name
			card.createEl('div', {
				cls: 'stats-card-title',
				text: operation.charAt(0).toUpperCase() + operation.slice(1)
			});

			// Accuracy percentage
			card.createEl('div', {
				cls: 'stats-card-value',
				text: `${accuracy.toFixed(1)}%`
			});

			// Problems count
			card.createEl('div', {
				cls: 'stats-card-secondary',
				text: `${correctProblems.length} correct out of ${operationProblems.length} problems`
			});

			// Average time
			card.createEl('div', {
				cls: 'stats-card-secondary',
				text: `Avg. time: ${avgTime.toFixed(2)}s`
			});

			// Visual accuracy indicator
			const indicatorDiv = card.createDiv({ cls: 'performance-indicator' });
			indicatorDiv.createDiv({
				cls: 'performance-bar',
				attr: { style: `width: ${accuracy}%` }
			});
		});

		// Add detailed stats table
		const detailsDiv = containerEl.createDiv({ cls: 'stats-section' });
		detailsDiv.createEl('h3', {
			cls: 'stats-section-header',
			text: 'Detailed Operation Statistics'
		});

		// Create table
		const table = detailsDiv.createEl('table', { cls: 'stats-table' });

		// Table header
		const thead = table.createEl('thead');
		const headerRow = thead.createEl('tr');
		headerRow.createEl('th', { text: 'Operation' });
		headerRow.createEl('th', { text: 'Problems' });
		headerRow.createEl('th', { text: 'Correct' });
		headerRow.createEl('th', { text: 'Accuracy' });
		headerRow.createEl('th', { text: 'Avg. Time (s)' });
		headerRow.createEl('th', { text: 'Performance' });

		// Table body
		const tbody = table.createEl('tbody');

		operations.forEach(operation => {
			const operationProblems = allProblems.filter(p => p.operation === operation);

			if (operationProblems.length === 0) return;

			const correctProblems = operationProblems.filter(p => p.correct);
			const accuracy = (correctProblems.length / operationProblems.length) * 100;

			// Calculate average response time
			const problemsWithTime = operationProblems.filter(p => p.responseTime);
			const avgTime = problemsWithTime.length > 0
				? problemsWithTime.reduce((sum, p) => sum + (p.responseTime || 0), 0) / problemsWithTime.length / 1000
				: 0;

			// Create table row
			const row = tbody.createEl('tr');

			// Operation name
			row.createEl('td', {
				text: operation.charAt(0).toUpperCase() + operation.slice(1)
			});

			// Total problems
			row.createEl('td', {
				text: operationProblems.length.toString()
			});

			// Correct problems
			row.createEl('td', {
				text: correctProblems.length.toString()
			});

			// Accuracy percentage
			row.createEl('td', {
				text: `${accuracy.toFixed(1)}%`
			});

			// Average time
			row.createEl('td', {
				text: avgTime.toFixed(2)
			});

			// Performance bar
			const performanceCell = row.createEl('td');
			const performanceDiv = performanceCell.createDiv({ cls: 'performance-indicator' });
			performanceDiv.createDiv({
				cls: 'performance-bar',
				attr: { style: `width: ${accuracy}%` }
			});
		});

		// Add Operation-specific tips based on performance
		const tipsDiv = containerEl.createDiv({ cls: 'stats-section' });
		tipsDiv.createEl('h3', {
			cls: 'stats-section-header',
			text: 'Performance Tips'
		});

		const tipsCard = tipsDiv.createDiv({ cls: 'stats-card' });

		// Find weakest operation
		const operationStats = operations.map(operation => {
			const operationProblems = allProblems.filter(p => p.operation === operation);
			if (operationProblems.length === 0) return { operation, accuracy: 100 };

			const correctProblems = operationProblems.filter(p => p.correct);
			const accuracy = (correctProblems.length / operationProblems.length) * 100;

			return { operation, accuracy };
		});

		const weakestOp = operationStats.reduce((prev, curr) =>
			prev.accuracy < curr.accuracy ? prev : curr
		);

		if (weakestOp && weakestOp.accuracy < 90) {
			tipsCard.createEl('p', {
				text: `Your accuracy with ${weakestOp.operation} problems is ${weakestOp.accuracy.toFixed(1)}%, which is your lowest performing operation.`
			});

			let tipText = '';
			switch(weakestOp.operation) {
				case 'addition':
					tipText = 'Practice breaking down larger addition problems into smaller steps, or try using the "make 10" strategy for faster mental calculations.';
					break;
				case 'subtraction':
					tipText = 'For subtraction, try counting up from the smaller number to the larger one, or using complements to 10/100 for faster calculations.';
					break;
				case 'multiplication':
					tipText = 'Focus on strengthening your times tables, and practice breaking down larger multiplication problems into smaller ones you know well.';
					break;
				case 'division':
					tipText = 'Remember that division is the inverse of multiplication. Strengthen your times tables to improve division speed.';
					break;
			}

			tipsCard.createEl('p', { text: tipText });

			tipsCard.createEl('p', {
				text: 'Consider adjusting the difficulty in settings to focus more on this operation type.'
			});
		} else {
			tipsCard.createEl('p', {
				text: 'Great job! Your performance is strong across all operations. Continue practicing to maintain your skills.'
			});
		}
	}

	createMetricCard(container: HTMLElement, title: string, value: string | number, secondary?: string) {
		const card = container.createDiv({ cls: 'stats-card' });
		card.createEl('div', { cls: 'stats-card-title', text: title });
		card.createEl('div', { cls: 'stats-card-value', text: value.toString() });

		if (secondary) {
			card.createEl('div', {
				cls: 'stats-card-secondary'
			}).innerHTML = secondary;
		}

		return card;
	}
}
