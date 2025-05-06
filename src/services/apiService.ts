/**
 * API Service for connecting with RandomPlayables platform
 * Handles session management and data storage
 */

// Update the base URL to use environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
  ? 'https://randomplayables.com/api'
  : 'http://172.31.12.157:3000/api');

console.log("Using API base URL:", API_BASE_URL);

// Game ID for Gotham Loops
const GAME_ID = 'gotham-loops';

/**
 * Initializes a game session with the platform
 * @returns Session information including sessionId
 */
export async function initGameSession() {
  try {
    // Clear any existing session on startup to force a new one
    localStorage.removeItem('gameSession');
    
    // Create a new session
    console.log("Initializing new game session with platform...");
    const response = await fetch(`${API_BASE_URL}/game-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId: GAME_ID }),
      mode: 'cors',  // Explicitly set CORS mode
      credentials: 'omit'  // Don't send cookies for cross-origin requests
    });
    
    if (!response.ok) {
      console.warn(`Could not connect to RandomPlayables platform. Status: ${response.status}. Using local session.`);
      const localSession = {
        sessionId: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        userId: null,
        isGuest: true,
        gameId: GAME_ID
      };
      localStorage.setItem('gameSession', JSON.stringify(localSession));
      return localSession;
    }
    
    const session = await response.json();
    console.log("Created new game session:", session);
    localStorage.setItem('gameSession', JSON.stringify(session));
    return session;
  } catch (error) {
    console.error('Error initializing game session:', error);
    // Fallback to local session
    const localSession = {
      sessionId: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: null,
      isGuest: true,
      gameId: GAME_ID
    };
    localStorage.setItem('gameSession', JSON.stringify(localSession));
    return localSession;
  }
}

/**
 * Saves round data to the platform
 * @param roundNumber Current round number
 * @param roundData Data to be saved
 * @returns Response from the server or null if offline
 */
export async function saveGameData(roundNumber: number, roundData: any) {
  try {
    // Log data to console for development/debugging
    console.log('Saving round data:', { roundNumber, roundData });
    
    // Get the current session
    const sessionString = localStorage.getItem('gameSession');
    if (!sessionString) {
      console.error('No active game session found in localStorage');
      throw new Error('No active game session');
    }
    
    const session = JSON.parse(sessionString);
    console.log('Using session for saving data:', session);
    
    // Check if this is a local session (offline mode)
    if (session.sessionId.startsWith('local-')) {
      console.log('Using local session, storing in localStorage');
      // Store in localStorage as backup
      const offlineData = JSON.parse(localStorage.getItem('offlineGameData') || '[]');
      offlineData.push({ roundNumber, roundData, timestamp: new Date().toISOString() });
      localStorage.setItem('offlineGameData', JSON.stringify(offlineData));
      return { success: true, offline: true };
    }
    
    // Send data to the server
    console.log(`Sending data to ${API_BASE_URL}/game-data`);
    const response = await fetch(`${API_BASE_URL}/game-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',  // Explicitly set CORS mode
      credentials: 'omit',  // Don't send cookies for cross-origin requests
      body: JSON.stringify({
        sessionId: session.sessionId,
        roundNumber,
        roundData
      }),
    });
    
    if (!response.ok) {
      console.error('Server response not OK:', response.status, response.statusText);
      // Try to get error details
      try {
        const errorData = await response.json();
        console.error('Error details:', errorData);
      } catch (e) {
        console.error('Could not parse error response');
      }
      
      // Fall back to storing locally if server request fails
      const offlineData = JSON.parse(localStorage.getItem('offlineGameData') || '[]');
      offlineData.push({ roundNumber, roundData, timestamp: new Date().toISOString() });
      localStorage.setItem('offlineGameData', JSON.stringify(offlineData));
      return { success: true, offline: true };
    }
    
    const result = await response.json();
    console.log('Server response:', result);
    return result;
  } catch (error) {
    console.error('Error saving game data:', error);
    // Store in localStorage as backup
    const offlineData = JSON.parse(localStorage.getItem('offlineGameData') || '[]');
    offlineData.push({ roundNumber, roundData, timestamp: new Date().toISOString() });
    localStorage.setItem('offlineGameData', JSON.stringify(offlineData));
    return { success: true, offline: true };
  }
}