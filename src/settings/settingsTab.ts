import { App, PluginSettingTab, Setting } from 'obsidian';
import ArithmeticGamePlugin from '../main';

// Settings Tab
export class ArithmeticGameSettingTab extends PluginSettingTab {
	plugin: ArithmeticGamePlugin;

	constructor(app: App, plugin: ArithmeticGamePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Arithmetic Game Settings' });

		// Operations section
		containerEl.createEl('h3', { text: 'Operations' });

		// Addition
		new Setting(containerEl)
			.setName('Addition')
			.setDesc('Enable addition problems')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.additionEnabled)
				.onChange(async (value) => {
					this.plugin.settings.additionEnabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Addition Range')
			.setDesc('Set the range for addition problems')
			.addText(text => text
				.setPlaceholder('Min A')
				.setValue(this.plugin.settings.additionMinA.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.additionMinA = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Max A')
				.setValue(this.plugin.settings.additionMaxA.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.additionMaxA = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Min B')
				.setValue(this.plugin.settings.additionMinB.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.additionMinB = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Max B')
				.setValue(this.plugin.settings.additionMaxB.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.additionMaxB = num;
						await this.plugin.saveSettings();
					}
				}));

		// Subtraction
		new Setting(containerEl)
			.setName('Subtraction')
			.setDesc('Enable subtraction problems')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.subtractionEnabled)
				.onChange(async (value) => {
					this.plugin.settings.subtractionEnabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Subtraction Range')
			.setDesc('Set the range for subtraction problems (A ≥ B for positive results)')
			.addText(text => text
				.setPlaceholder('Min A')
				.setValue(this.plugin.settings.subtractionMinA.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.subtractionMinA = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Max A')
				.setValue(this.plugin.settings.subtractionMaxA.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.subtractionMaxA = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Min B')
				.setValue(this.plugin.settings.subtractionMinB.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.subtractionMinB = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Max B')
				.setValue(this.plugin.settings.subtractionMaxB.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.subtractionMaxB = num;
						await this.plugin.saveSettings();
					}
				}));

		// Multiplication
		new Setting(containerEl)
			.setName('Multiplication')
			.setDesc('Enable multiplication problems')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.multiplicationEnabled)
				.onChange(async (value) => {
					this.plugin.settings.multiplicationEnabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Multiplication Range')
			.setDesc('Set the range for multiplication problems')
			.addText(text => text
				.setPlaceholder('Min A')
				.setValue(this.plugin.settings.multiplicationMinA.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.multiplicationMinA = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Max A')
				.setValue(this.plugin.settings.multiplicationMaxA.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.multiplicationMaxA = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Min B')
				.setValue(this.plugin.settings.multiplicationMinB.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.multiplicationMinB = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Max B')
				.setValue(this.plugin.settings.multiplicationMaxB.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.multiplicationMaxB = num;
						await this.plugin.saveSettings();
					}
				}));

		// Division
		new Setting(containerEl)
			.setName('Division')
			.setDesc('Enable division problems')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.divisionEnabled)
				.onChange(async (value) => {
					this.plugin.settings.divisionEnabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Division Range')
			.setDesc('Set the range for division problems (result is the quotient)')
			.addText(text => text
				.setPlaceholder('Min Result')
				.setValue(this.plugin.settings.divisionMinA.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.divisionMinA = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Max Result')
				.setValue(this.plugin.settings.divisionMaxA.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.divisionMaxA = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Min Divisor')
				.setValue(this.plugin.settings.divisionMinB.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.divisionMinB = num;
						await this.plugin.saveSettings();
					}
				}))
			.addText(text => text
				.setPlaceholder('Max Divisor')
				.setValue(this.plugin.settings.divisionMaxB.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.divisionMaxB = num;
						await this.plugin.saveSettings();
					}
				}));

		// Game Settings
		containerEl.createEl('h3', { text: 'Game Settings' });

		new Setting(containerEl)
			.setName('Game Duration')
			.setDesc('Duration of the game in seconds')
			.addSlider(slider => slider
				.setLimits(10, 300, 10)
				.setValue(this.plugin.settings.gameDuration)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.gameDuration = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Results Note Path')
			.setDesc('Path where game results will be saved as markdown')
			.addText(text => text
				.setPlaceholder('ArithmeticGameResults.md')
				.setValue(this.plugin.settings.resultsNotePath)
				.onChange(async (value) => {
					this.plugin.settings.resultsNotePath = value;
					await this.plugin.saveSettings();
				}));

		// UI Settings
		containerEl.createEl('h3', { text: 'UI Settings' });

		new Setting(containerEl)
			.setName('Show Feedback')
			.setDesc('Show feedback messages after each answer')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showFeedback)
				.onChange(async (value) => {
					this.plugin.settings.showFeedback = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Show Problem History')
			.setDesc('Show problem history on the results screen and in saved results')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showHistory)
				.onChange(async (value) => {
					this.plugin.settings.showHistory = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Dark Mode')
			.setDesc('Use dark mode for the game interface')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.darkMode)
				.onChange(async (value) => {
					this.plugin.settings.darkMode = value;
					await this.plugin.saveSettings();
				}));

		// Analytics Settings
		containerEl.createEl('h3', { text: 'Analytics Settings' });

		new Setting(containerEl)
			.setName('Save Structured Data')
			.setDesc('Save detailed game data for statistics and analysis')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.saveStructuredData)
				.onChange(async (value) => {
					this.plugin.settings.saveStructuredData = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Export Data')
			.setDesc('Export all game data to CSV files')
			.addButton(button => button
				.setButtonText('Export to CSV')
				.onClick(() => {
					this.plugin.exportResultsCSV();
				}));
	}
}
