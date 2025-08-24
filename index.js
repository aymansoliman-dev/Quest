/**
 * Quest Quiz Application - Main Entry Point
 * 
 * A modern, accessible quiz application built with vanilla JavaScript
 * Features: Interactive questions, timer system, dark/light themes, and comprehensive accessibility
 * 
 * @author Ayman Soliman
 * @version 1.0.0
 */

import QuizApp from './components/QuizApp.js'
import TransitionUtils from './components/TransitionUtils.js'


// ========================================
// THEME INITIALIZATION
// ========================================
// Note: Theme is now initialized in HTML <head> to prevent flash

// ========================================
// INTRODUCTION SCREEN SETUP
// ========================================

/**
 * Creates and renders the introduction/welcome screen
 */
function createIntroductionScreen() {
    const introduction = document.createElement('section');
    introduction.id = 'introduction';
    
    introduction.innerHTML = `
        <h1>Welcome to Quest!</h1>
        <p>Test your knowledge with interactive quizzes.</p>
        <button id="start-button">Start Quiz</button>
    `;
    
    return introduction;
}

/**
 * Handles the start quiz button click event with smooth transitions
 * Removes introduction and initializes the quiz application
 */
async function handleStartQuiz(introductionElement) {
    
    try {
        // Add loading state to button
        const startButton = document.getElementById('start-button');
        const originalText = startButton.textContent;
        startButton.disabled = true;
        startButton.textContent = '🎯 Starting Quiz...';
        
        // Fade out introduction
        await TransitionUtils.fadeOut(introductionElement);
        introductionElement.remove();
        
        // Load questions and start quiz
        const response = await fetch('./questions.json');
        await renderQuizApp(response);
        
        
    } catch (error) {
        console.error('❌ Failed to start quiz:', error);
        
        // Show error message with transition
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-color);
                    background: var(--container-color);
                    border-radius: 1rem;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
                    max-width: 500px;
                    margin: auto;
                ">
                    <h2>⚠️ Failed to Load Quiz</h2>
                    <p>There was an error loading the quiz questions. Please try again.</p>
                    <button onclick="location.reload()" style="
                        background: var(--custom-background);
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        color: black;
                        font-size: 1rem;
                    ">🔄 Retry</button>
                </div>
            `;
            
            const errorElement = main.querySelector('div');
            await TransitionUtils.bounceIn(errorElement);
        }
    }
}

/**
 * Renders and initializes the main quiz application with smooth transitions
 * @param {Response} response - Fetch response containing questions JSON
 */
async function renderQuizApp(response) {
    try {
        const questions = await response.json();
        
        // Initialize QuizApp with questions data
        const quizApp = new QuizApp(questions);
        
        // Setup quiz components
        quizApp.initiate();
        quizApp.setQuestionsSliderElement();
        quizApp.setNextQuestionButton();
        quizApp.setTimerElement();
        
        // Start the quiz timer immediately
        quizApp.startCounter();
                
    } catch (error) {
        console.error('❌ Error initializing quiz app:', error);
        throw error; // Re-throw to be handled by caller
    }
}

// ========================================
// APPLICATION INITIALIZATION
// ========================================

// Create and setup introduction screen
const introduction = createIntroductionScreen();
document.body.querySelector('main').appendChild(introduction);

// Setup start button event listener
document.getElementById('start-button').addEventListener('click', () => {
    handleStartQuiz(introduction);
});