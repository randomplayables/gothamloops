## Playing Gotham Loops In Real Life

### Materials Needed

- Grid with:
  - 13×13 grid for "Deuce" difficulty
  - 17×17 grid for "Trey" difficulty
  - 21×21 grid for "Quad" difficulty
- Game marker or token
- 2-4 coins (depending on difficulty)
- Colored pens or markers (at least 7 different colors)
- Paper for scoring

### Setup

1. Draw your grid based on the chosen difficulty level
2. Mark the center cell as "Home" with a distinctive color
3. Place your game marker on the Home cell
4. Choose your difficulty:
   - Deuce: Use 2 coins
   - Trey: Use 3 coins
   - Quad: Use 4 coins
5. Assign a unique color to each of the 7 rounds you'll play

### Gameplay

1. **Starting the Game**:
   - Begin at the home cell in the center of the grid
   - You'll play for a total of 7 rounds
   - Use a different color marker for each round

2. **Moving**:
   - On each turn, move to an adjacent cell (up, down, left, or right)
   - Mark visited cells with the current round's color
   - Diagonal moves are not allowed

3. **Probability Check**:
   - When entering a new cell, determine your allowed number of flips:
     - Base flips = Maximum distance to any corner - Distance from home + 1
     - Extra flips calculation:
       1) Look at the current cell and its 4 adjacent cells (above, below, left, right)
       2) For each of these 5 cells, count how many unique previous rounds it was visited in
       3) Add these 5 counts together to get your total extra flips
     - Total flips = Base flips + Extra flips
   
   - Then perform the probability check:
     - Flip all your coins together (2, 3, or 4 depending on difficulty)
     - Success: If you get ALL HEADS in at least one of your allowed flips
     - Failure: If you never get all heads within your allowed number of flips

   - If you fail: The round ends immediately and you score 0 points for this round
   - If you succeed: Mark the cell with your current round's color and continue

4. **Scoring**:
   - For each newly visited cell in a round, earn points equal to:
     - Manhattan distance from home (|row distance| + |column distance|)
     - Subtract 1 point for each previous round in which the cell was visited
     - Points can never go below 0 for a cell
   - No points for revisiting cells within the same round
   - You must return to the home cell to secure your points for the round

5. **Ending a Round**:
   - Round ends when you either:
     - Return to the home cell (success - keep your score)
     - Fail a probability check (failure - 0 points for that round)

6. **Multi-Round Strategy**:
   - After each round, cells you visited (and their neighbors) become safer in future rounds
   - Previously visited cells are worth fewer points but their neighbors retain full value
   - Your total score accumulates across all seven rounds

### Scoring Example

**Round 1:**
- Home is at coordinates (6,6) in a 13×13 grid
- Moving to (6,7): 1 point (distance 1 from home)
- Moving to (6,8): 2 points (distance 2)
- Moving to (7,8): 3 points (distance 3)
- Moving to (7,7): 2 points (distance 2)
- Moving to (7,6): 1 point (distance 1)
- Moving to (6,6): 0 points (home cell)

Round 1 Score: 9 points
Total Score: 9 points

**Round 2:**
- Starting again at home (6,6)
- Moving to (5,6): 1 point (distance 1)
- Moving to (5,7): 2 points (distance 2)
- Moving to (6,7): 0 points (visited in Round 1, so 1-1=0)
- Moving to (6,8): 1 point (visited in Round 1, so 2-1=1)
- Moving to (5,8): 3 points (distance 3, not visited before)
- Moving to (5,7): 0 points (already visited this round)
- Moving to (5,6): 0 points (already visited this round)
- Moving to (6,6): 0 points (home cell)

Round 2 Score: 7 points
Total Score: 16 points