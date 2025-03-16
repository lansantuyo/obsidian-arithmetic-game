// Operation types
export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

// Problem interface - represents a single arithmetic problem
export interface Problem {
	a: number;
	b: number;
	operation: Operation;
	answer: number;
	userAnswer?: number;
	correct?: boolean;
	text: string;
	responseTime?: number; // Time in ms to solve the problem
}

// Game result interface - represents the results of a completed game
export interface GameResult {
	timestamp: string;
	score: number;
	problemsSolved: number;
	accuracy: number;
	duration: number;
	operations: Operation[];
	problems: {
		operation: Operation;
		text: string;
		answer: number;
		userAnswer?: number;
		correct?: boolean;
		responseTime?: number;
	}[];
}
