# Arithmetic Game for Obsidian

A mental arithmetic practice plugin for [Obsidian](https://obsidian.md) that helps you improve your calculation speed and accuracy through customizable speed drills. Based on arithmetic.zetamac

## Features

- **Fast-paced arithmetic practice**: Solve as many problems as you can within a time limit
- **Multiple operations**: Addition, subtraction, multiplication, and division
- **Customizable difficulty**: Configure number ranges for each operation
- **Performance tracking**: Detailed statistics and performance analysis
- **Data visualization**: View your progress over time
- **Export capabilities**: Export your results as CSV for external analysis

## Installation

### From Obsidian Community Plugins

1. Open Obsidian
2. Go to Settings → Community plugins
3. Turn off Safe mode if prompted
4. Click "Browse" and search for "Arithmetic Game"
5. Install the plugin and enable it

### Manual Installation

1. Download the latest release from the GitHub repository
2. Extract the zip file into your Obsidian vault's `.obsidian/plugins/` directory
3. Enable the plugin in Obsidian's settings under Community Plugins

## Usage

### Starting a Game

1. Click the calculator icon in the ribbon menu, or
2. Use the command palette (Ctrl+P) and search for "Open Arithmetic Game"
3. Select which operations you want to practice
4. Choose a duration
5. Click "Start Game"

### Playing the Game

1. A math problem will appear on screen
2. Type your answer in the input field
3. If correct, you'll automatically advance to the next problem
4. If incorrect, you'll need to provide the correct answer before continuing
5. The game ends when the timer runs out

### Viewing Statistics

1. Click "View Statistics" on the game start or results screen, or
2. Use the command palette and search for "Open Arithmetic Game Statistics"
3. Browse your performance data across different tabs:
   - **Overview**: Key metrics and recent performance
   - **Game History**: Detailed history of all your games
   - **Operations**: Performance breakdown by operation type

## Configuration

### Game Settings

- **Operations**: Enable/disable addition, subtraction, multiplication, and division
- **Number Ranges**: Set minimum and maximum values for each operation
- **Game Duration**: Set how long each game lasts (10-300 seconds)
- **UI Settings**: Toggle dark mode, feedback messages, and problem history
- **Analytics**: Configure data saving and export options

### Operation Settings

For each operation, you can set custom ranges:

- **Addition**: Configure the range of numbers to add
- **Subtraction**: Configure minuends and subtrahends (always produces positive results)
- **Multiplication**: Configure factors
- **Division**: Configure quotients and divisors (always produces whole number results)

## Data Storage

The plugin stores two types of data:

1. **Markdown Results**: Human-readable game results stored at the specified location in your vault
2. **Structured Data**: JSON data used for statistics, stored in `.arithmetic_game/results.json`

You can export data to CSV files for external analysis using the export button in the statistics view or via the command palette.

## Development

### Building the plugin

1. Clone this repository
2. Run `npm install`
3. Run `npm run dev` to start the development build process

### Project Structure

```
arithmetic-game-plugin/
├── src/
│   ├── main.ts                 # Plugin definition, initialization, commands
│   ├── models/
│   │   ├── settings.ts         # Settings interface and defaults
│   │   └── gameResult.ts       # Game result data structures
│   ├── views/
│   │   ├── gameView.ts         # Game view implementation
│   │   └── statsView.ts        # Statistics view implementation 
│   └── settings/
│       └── settingsTab.ts      # Settings tab UI
```

## Acknowledgements

- Built for the Obsidian to help practice mental arithmetic
- 1005 inspired by [Arithmetic Zetamac]([https://obsidian.md](https://arithmetic.zetamac.com/))

---

If you find any bugs or have feature requests, please file an issue on the GitHub repository.
