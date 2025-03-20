# Gotham Loops

## Overview

Gotham Loops is a strategy game of probability and risk management where players navigate a grid-based environment, trying to explore as much territory as possible and make it back home without getting caught. The game combines elements of pathfinding, risk assessment, and strategic planning across multiple rounds.

In Gotham Loops, each cell on the grid has a probability value that determines your chance of successfully visiting it. The farther you venture from the center "home" cell, the riskier your journey becomes. However, greater risks also offer greater rewards, as your score is primarily based on how far you travel from home.

To succeed, you'll need to carefully balance risk and reward while creating efficient routes through the grid.

![Gotham Loops Gameplay](https://placeholder-for-game-screenshot.png)

## Features

- Three difficulty levels (Deuce, Trey, Quad) with increasing grid sizes and complexity
- Seven rounds
- Visual tracking of previously visited cells across rounds
- Real-time score calculation
- Probability-based game mechanics that adapt to your play style

## Online Game Rules

### Getting Started

1. Select your difficulty level:
   - **Deuce**: 13x13 grid (Beginner)
   - **Trey**: 17x17 grid (Intermediate)
   - **Quad**: 21x21 grid (Advanced)

2. The game begins at the center "home" cell (marked in red).

### Basic Gameplay

1. **Goal**: Explore cells to earn points and safely return to the home cell before ending the round.

2. **Movement**:
   - Click on any adjacent cell (up, down, left, or right) to move.
   - Diagonal movement is not allowed.
   
3. **Cell Probabilities**:
   - Each cell has a hidden probability value determining your chance of success when visiting it.
   - Cells closer to home are safer (higher probability of success).
   - Cells farther from home are riskier (lower probability of success).
   - The home cell always has a 100% success rate.

4. **Scoring**:
   - Score is based on the Manhattan distance from home (how many steps away).
   - Visiting cells farther from home earns more points.
   - Revisiting cells you've already been to in the current round earns no additional points.
   - Visiting cells you've been to in previous rounds grants reduced points.

5. **Round Ending**:
   - A round ends when either:
     - You return to the home cell after exploring (success).
     - You "fail" a probability check when entering a cell (game over for that round).
   - When you fail a probability check, the cell will turn red, and your score for that round becomes zero.
   - When you successfully return home, the home cell turns green, and your score is saved.

6. **Multi-Round Strategy**:
   - After each round, the cells you visited and the adjacent cells become less risky in subsequent rounds.
   - Also after each round, the cells you visited become less valuable to revisit.
   - Your total score accumulates across all seven rounds.

7. **Game Completion**:
   - The game ends after seven rounds.
   - Your final score is the sum of your scores across all rounds.

### Visual Indicators

- **Red Cell**: Home cell or failure point
- **Blue Cell**: Successfully visited cell in the current round
- **Colored Rings**: Cells visited in previous rounds (each round has a different color)
- **Cell with Asterisk (*)**: Your current position

## Playing Gotham Loops In Real Life

### Materials Needed

- Grid paper with:
  - 13×13 grid for "Deuce" difficulty
  - 17×17 grid for "Trey" difficulty
  - 21×21 grid for "Quad" difficulty
- Pencil
- 2-4 coins (depending on difficulty)
- Colored markers or highlighters (at least 7 different colors)
- Calculator (optional)

### Setup

1. Mark the center cell as "Home" with a red marker.
2. Place your game piece or marker on the Home cell.
3. Choose your difficulty:
   - Deuce: Use 2 coins
   - Trey: Use 3 coins
   - Quad: Use 4 coins

### Gameplay

1. **Starting the Game**:
   - Begin at the home cell in the center of the grid.
   - You'll play for a total of 7 rounds.

2. **Moving**:
   - On each turn, move to an adjacent cell (up, down, left, or right).
   - Diagonal moves are not allowed.

3. **Probability Check**:
   - When entering a new cell, perform a probability check:
     - Flip your coins (2, 3, or 4 depending on difficulty).
     - Success: If at least one coin shows heads, you successfully enter the cell.
     - Failure: If all coins show tails, you fail and end the round with 0 points.
   
4. **Calculating Cell Probabilities** (for reference):
   - The base number of "flips" for a cell = (maximum distance from corner to home) - (cell's distance from home) + 1
   - Probability of success = 1 - (1 - 0.5^numCoins)^flips
   - Home cell always has 100% success rate

5. **Scoring**:
   - Each time you successfully enter a new cell, score points equal to its Manhattan distance from home.
   - Manhattan distance = |row_distance| + |column_distance|
   - No points for revisiting cells in the same round.
   - -1 point penalty for visiting cells you've been to in previous rounds.

6. **Ending a Round**:
   - Round ends when you either:
     - Return to the home cell (success)
     - Fail a probability check (0 points for that round)
   - Mark all visited cells in this round with the current round's color.

7. **Next Rounds**:
   - When starting a new round, all previously visited cells become riskier.
   - For each cell that you or its neighbors visited in previous rounds, add extra "flips" to improve its success chance.

### Scoring Example

- Home is at coordinates (6,6) in a 13×13 grid
- Moving to cell (6,7) = 1 point (distance of 1)
- Moving to cell (6,8) = 2 points (distance of 2)
- Moving to cell (7,8) = 3 points (distance of 3)
- Moving to cell (7,7) = 2 points (distance of 2)
- Moving to cell (7,6) = 1 point (distance of 1)
- Moving to cell (6,6) = 0 points (home cell)

Total score for this round: 9 points

## Strategies for Success

1. **Risk Management**: Balance exploring far cells (high points) with the risk of failure.
2. **Path Planning**: Create efficient routes that maximize distance while minimizing risk.
3. **Round Progression**: Early rounds are good for exploration, while later rounds require more caution.
4. **Return Home**: Don't forget to return to the home cell to secure your points for the round.
5. **Pattern Recognition**: Notice how probabilities change across rounds and adapt your strategy.

## Development

This game was built using:
- React
- TypeScript
- Vite

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

randomplayables@proton.me
