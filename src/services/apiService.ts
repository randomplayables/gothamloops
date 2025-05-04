// src/services/apiService.ts
/**
 * API Service for connecting with RandomPlayables platform
 * Handles session management and data storage
 */

// Base URL for the RandomPlayables API - update with EC2 public IP
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://randomplayables.com/api'
  : 'http://54.67.39.91:3000/api';  // Use your EC2 public IP

// Game ID for Gotham Loops
const GAME_ID = 'gotham-loops';

/**
 * Initializes a game session with the platform
 * @returns Session information including sessionId
 */
export async function initGameSession() {
  try {
    // Try to get an existing session from localStorage
    const existingSession = localStorage.getItem('gameSession');
    if (existingSession) {
      // Verify if the session is still valid
      const session = JSON.parse(existingSession);
      const isValid = await verifySession(session.sessionId);
      if (isValid) return session;
    }
    
    // Create a new session
    const response = await fetch(`${API_BASE_URL}/game-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId: GAME_ID }),
      mode: 'cors',  // Explicitly set CORS mode
    });
    
    if (!response.ok) {
      // If we can't connect to the platform, create a local session
      console.warn('Could not connect to RandomPlayables platform. Using local session.');
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
 * Verifies if a session is still valid
 * @param sessionId Session ID to verify
 * @returns Boolean indicating if the session is valid
 */
async function verifySession(sessionId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/game-session?sessionId=${sessionId}`, {
      method: 'GET',
      mode: 'cors',  // Explicitly set CORS mode
    });
    return response.ok;
  } catch (error) {
    console.error('Error verifying session:', error);
    return false;
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
      throw new Error('No active game session');
    }
    
    const session = JSON.parse(sessionString);
    
    // Check if this is a local session (offline mode)
    if (session.sessionId.startsWith('local-')) {
      // Store in localStorage as backup
      const offlineData = JSON.parse(localStorage.getItem('offlineGameData') || '[]');
      offlineData.push({ roundNumber, roundData, timestamp: new Date().toISOString() });
      localStorage.setItem('offlineGameData', JSON.stringify(offlineData));
      return { success: true, offline: true };
    }
    
    // Send data to the server
    const response = await fetch(`${API_BASE_URL}/game-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',  // Explicitly set CORS mode
      body: JSON.stringify({
        sessionId: session.sessionId,
        roundNumber,
        roundData
      }),
    });
    
    if (!response.ok) {
      // Fall back to storing locally if server request fails
      const offlineData = JSON.parse(localStorage.getItem('offlineGameData') || '[]');
      offlineData.push({ roundNumber, roundData, timestamp: new Date().toISOString() });
      localStorage.setItem('offlineGameData', JSON.stringify(offlineData));
      return { success: true, offline: true };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving game data:', error);
    // Store in localStorage as backup
    const offlineData = JSON.parse(localStorage.getItem('offlineGameData') || '[]');
    offlineData.push({ roundNumber, roundData, timestamp: new Date().toISOString() });
    localStorage.setItem('offlineGameData', JSON.stringify(offlineData));
    return { success: true, offline: true };
  }
}