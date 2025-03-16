// Define the plugin settings interface
export interface ArithmeticGameSettings {
	// Operation settings
	additionEnabled: boolean;
	subtractionEnabled: boolean;
	multiplicationEnabled: boolean;
	divisionEnabled: boolean;

	// Range settings
	additionMinA: number;
	additionMaxA: number;
	additionMinB: number;
	additionMaxB: number;

	subtractionMinA: number;
	subtractionMaxA: number;
	subtractionMinB: number;
	subtractionMaxB: number;

	multiplicationMinA: number;
	multiplicationMaxA: number;
	multiplicationMinB: number;
	multiplicationMaxB: number;

	divisionMinA: number;
	divisionMaxA: number;
	divisionMinB: number;
	divisionMaxB: number;

	// Game settings
	gameDuration: number;
	resultsNotePath: string;

	// UI Settings
	showFeedback: boolean;
	showHistory: boolean;
	darkMode: boolean;

	// Analytics Settings
	saveStructuredData: boolean;
	structuredDataPath: string;
}

// Default settings
export const DEFAULT_SETTINGS: ArithmeticGameSettings = {
	additionEnabled: true,
	subtractionEnabled: true,
	multiplicationEnabled: true,
	divisionEnabled: true,

	additionMinA: 2,
	additionMaxA: 100,
	additionMinB: 2,
	additionMaxB: 100,

	subtractionMinA: 2,
	subtractionMaxA: 100,
	subtractionMinB: 2,
	subtractionMaxB: 100,

	multiplicationMinA: 2,
	multiplicationMaxA: 12,
	multiplicationMinB: 2,
	multiplicationMaxB: 100,

	divisionMinA: 2,
	divisionMaxA: 100,
	divisionMinB: 2,
	divisionMaxB: 10,

	gameDuration: 120,
	resultsNotePath: 'ArithmeticGameResults.md',

	showFeedback: true,
	showHistory: true,
	darkMode: false,

	saveStructuredData: true,
	structuredDataPath: '.arithmetic_game/results.json'
};
