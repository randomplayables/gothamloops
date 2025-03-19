/**
 * Main application entry point for Gotham Loops game.
 * 
 * This file is responsible for bootstrapping the React application.
 * It renders the root App component into the DOM element with id 'root'
 * and enables React's StrictMode for additional development checks.
 * 
 * @module main
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Initialize the React application by rendering the App component into the DOM.
 * 
 * Uses React 18's createRoot API for Concurrent Mode rendering and wraps the
 * application in StrictMode to help identify potential problems during development.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
