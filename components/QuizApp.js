import Header from './Header.js'
import Slider from './Slider.js'
import Controls from './Controls.js'
import ResultsComponent from './ResultsComponent.js'
import TransitionUtils from './TransitionUtils.js'

/**
 * Main QuizApp class - Controls the entire quiz application flow
 * Manages questions, scoring, timing, and user interactions
 * 
 * @class QuizApp
 * @author Ayman Soliman
 */
export default class QuizApp {
    /**
     * Creates an instance of QuizApp
     * 
     * @param {Array<Object>} questions - Array of question objects with title, answers, and correct_answer
     * @memberof QuizApp
     */
    constructor(questions) {
        this.questions = questions
        this.quizElement = null
        this.questionsSliderElement = null
        this.nextQuestionButton = null
        this.timerElement = null
        this.currentQuestionNumber = 1
        this.currentQuestionBulletElement = null
        this.score = 0
        this.numberOfQuestions = questions.length
        
        // Timer configuration
        this.questionTime = 30 // seconds per question
        this.counter = null
        
        // Bind event handlers to maintain context
        this.handleClick = this.handleClick.bind(this)
    }

    initiate() {
        document.querySelector('main').before(new Header().render())

        const quiz = document.createElement('section')
        quiz.id = 'quiz'
        document.body.querySelector('main').appendChild(quiz)
        quiz.appendChild(new Slider().render(this.questions))
        quiz.appendChild(new Controls(this.numberOfQuestions).render())

        this.currentQuestionBulletElement = document.querySelector('.question-status')
        this.currentQuestionBulletElement.classList.add('current')

        this.quizElement = quiz
        document.querySelector('.question > p').focus()
        this.quizElement.addEventListener('click', this.handleClick)
    }

    handleClick(e) {
        if (e.target.closest('.answer')) {
            // ✅ FIX: Prevent double submission by checking if question already answered
            const currentQuestion = document.querySelector(`.question[data-question-number="${this.currentQuestionNumber}"]`)
            
            // If question is already disabled (answered), ignore this click
            if (currentQuestion && currentQuestion.hasAttribute('inert')) {
                return
            }
            
            // Stop event propagation to prevent bubbling
            e.stopPropagation()
            
            // Clear timer and hide it
            clearInterval(this.counter)
            this.counter = null
            this.timerElement.style.display = 'none'
            
            const answerElement = e.target.closest('.answer')
            this.checkAnswer(answerElement)
            this.disableCurrentQuestion()

            if (this.currentQuestionNumber === this.numberOfQuestions) {
                this.currentQuestionBulletElement.classList.remove('current')
                this.addDisplayResultsComponent()
            }
            else this.enableNextQuestionButton()
        }
        else if (e.target === this.nextQuestionButton) {
            this.currentQuestionNumber++
            this.nextQuestionButton.disabled = true
            if (this.currentQuestionNumber >= this.numberOfQuestions) this.nextQuestionButton.remove()
            this.questionsSliderElement.__instance.slide()
            this.enableCurrentQuestion()
            this.moveCurrentQuestionBullet()

            //
            setTimeout(() => {
                document.querySelector(`.question[data-question-number="${this.currentQuestionNumber -1}"]`).style.display = 'none'
                this.questionsSliderElement.scrollBy({
                    left: - this.questionsSliderElement.clientWidth,
                    behavior: 'instant'
                })
            }, 700)
        }
    }

    checkAnswer(answerElement) {
        const currentQuestion = document.querySelector(`.question[data-question-number="${this.currentQuestionNumber}"]`)
        const currentQuestionCorrectAnswer = currentQuestion.__instance.questionCorrectAnswer
        const answerElementValue = answerElement.querySelector('input').value
        const screenReaderOutput = document.getElementById('sr-output')

        // ✅ Additional safeguard: Check if this answer was already processed
        if (answerElement.classList.contains('correct') || 
            answerElement.classList.contains('incorrect')) {
            console.warn('⚠️ Answer already processed, preventing duplicate scoring')
            return
        }

        if (currentQuestionCorrectAnswer === answerElementValue) {
            answerElement.classList.add('correct')
            this.currentQuestionBulletElement.classList.add('correct')
            this.score++
            screenReaderOutput.textContent.startsWith('Correct Answer!')? screenReaderOutput.textContent += '!' : screenReaderOutput.textContent = 'Correct Answer!'
        }
        else {
            answerElement.classList.add('incorrect')
            this.currentQuestionBulletElement.classList.add('incorrect')
            document.querySelector(`input[value="${currentQuestionCorrectAnswer}"]`).closest('.answer').classList.add('correct')
            screenReaderOutput.textContent = `Incorrect Answer! The correct answer is: ${currentQuestionCorrectAnswer}`
        }
    }

    setQuestionsSliderElement() {
        this.questionsSliderElement = document.getElementById('questions-slider')
    }

    setNextQuestionButton() {
        this.nextQuestionButton = document.getElementById('next-button')
    }

    setTimerElement() {
        this.timerElement = document.getElementById('timer')
    }

    startCounter() {
        // ✅ FIX 1: Clear any existing timer before starting new one
        if (this.counter) {
            clearInterval(this.counter)
            this.counter = null
        }
        
        // Setup timer display
        this.timerElement.innerHTML = `<span>30</span><span class="lower-case">s</span> left`
        this.timerElement.style.display = 'block'
        this.timerElement.querySelector('span').textContent = this.questionTime
        
        // ✅ FIX 2: Initialize seconds counter properly
        let secondsLeft = this.questionTime
        
        // ✅ FIX 3: Start new timer with proper cleanup
        this.counter = setInterval(() => {
            secondsLeft--
            if (secondsLeft > 0) {
                this.timerElement.querySelector('span').textContent = secondsLeft
            } else {
                // Time's up - clear timer immediately
                this.timerElement.textContent = `Time's Up!`
                clearInterval(this.counter)
                this.counter = null
                
                // Handle time up scenario
                this.handleTimeUp()
            }
        }, 1000)
    }

    revealTheCorrectAnswer() {
        const currentQuestion = document.querySelector(`.question[data-question-number="${this.currentQuestionNumber}"]`)
        const currentQuestionCorrectAnswer = currentQuestion.__instance.questionCorrectAnswer
        const correctAnswerElement = document.querySelector(`input[value="${currentQuestionCorrectAnswer}"]`).closest('.answer')
        correctAnswerElement.classList.add('not-answered', 'correct')
        document.getElementById('sr-output').textContent = `Question Time is Up! The correct answer was: ${this.questions[this.currentQuestionNumber - 1]["correct_answer"]}`
    }

    disableCurrentQuestion() {
        const currentQuestionElement = document.querySelector(`.question[data-question-number="${this.currentQuestionNumber}"]`)
        currentQuestionElement.setAttribute('checked', '')
        // currentQuestionElement.setAttribute('aria-hidden', 'true')
        const currentQuestionElementAnswers = currentQuestionElement.querySelectorAll('.answer')
        currentQuestionElementAnswers.forEach(answer => {
            answer.setAttribute('aria-disabled', 'true')
        })
        currentQuestionElement.setAttribute('inert', '')
    }

    enableCurrentQuestion() {
        const currentQuestionElement = document.querySelector(`.question[data-question-number="${this.currentQuestionNumber}"]`)
        currentQuestionElement.removeAttribute('inert')
        const readTheQuestionTitle = setTimeout(() => {
            currentQuestionElement.querySelector('p').focus()
            this.startCounter()
            clearTimeout(readTheQuestionTitle)
        }, 700)
    }

    enableNextQuestionButton() {
        this.nextQuestionButton.disabled = false
    }

    moveCurrentQuestionBullet() {
        this.currentQuestionBulletElement.classList.remove('current')
        this.currentQuestionBulletElement = this.currentQuestionBulletElement.nextElementSibling
        this.currentQuestionBulletElement.classList.add('current')
    }

    /**
     * Handles the time up scenario when timer reaches zero
     */
    handleTimeUp() {
        this.revealTheCorrectAnswer()
        this.currentQuestionBulletElement.classList.add('not-answered')
        this.disableCurrentQuestion()

        if (this.currentQuestionNumber === this.numberOfQuestions) {
            this.currentQuestionBulletElement.classList.remove('current')
            this.addDisplayResultsComponent()
        } else {
            this.enableNextQuestionButton()
        }
    }

    /**
     * ✅ FIX 4: Prevent duplicate results buttons
     */
    addDisplayResultsComponent() {
        // Check if results button already exists
        const existingButton = document.getElementById('results-button')
        if (existingButton) {
            return // Don't create duplicate
        }
        
        const showResultsButton = document.createElement('button')
        showResultsButton.id = 'results-button'
        showResultsButton.innerText = 'Show Results'
        
        const controllersElement = document.getElementById('controllers')
        if (controllersElement) {
            controllersElement.prepend(showResultsButton)
            
            // Add event listener only once
            showResultsButton.addEventListener('click', () => {
                this.showResults()
            })
        }
    }
    
    /**
     * Shows the final results screen with transition and proper focus for screen readers
     */
    async showResults() {
        const mainElement = document.querySelector('main')
        const quizElement = document.getElementById('quiz')
        
        if (mainElement && quizElement) {
            // Fade out quiz
            await TransitionUtils.fadeOut(quizElement)
            
            // Clear main and add results
            mainElement.innerHTML = ''
            const resultsElement = new ResultsComponent(
                this.questionsSliderElement, 
                this.numberOfQuestions, 
                this.score,
                this // Pass quiz app instance for reset functionality
            ).render()
            
            mainElement.appendChild(resultsElement)
            
            // Animate in results
            await TransitionUtils.scaleIn(resultsElement)
            
            // ✅ Focus on score element for screen reader accessibility
            const scoreElement = document.getElementById('score')
            if (scoreElement) {
                // Set focus after animation completes
                setTimeout(() => {
                    scoreElement.focus()
                }, 100)
            }
        }
    }
    
    /**
     * Resets the app to introduction screen without page reload
     * @returns {Promise} Resolves when reset is complete
     */
    async resetQuiz() {
        
        // Reset all properties to initial state
        this.currentQuestionNumber = 1
        this.score = 0
        this.counter = null
        
        // Clear any existing timers
        if (this.counter) {
            clearInterval(this.counter)
            this.counter = null
        }
        
        // Remove existing elements
        const header = document.querySelector('header')
        const main = document.querySelector('main')
        const existingQuiz = document.getElementById('quiz')
        const existingResults = document.getElementById('results')
        const retakeButton = document.getElementById('retake-quiz-button')
        
        // Clean up existing elements
        if (header) {
            header.remove()
        }
        if (retakeButton) {
            retakeButton.remove()
        }
        if (existingQuiz) {
            existingQuiz.remove()
        }
        if (existingResults) {
            await TransitionUtils.fadeOut(existingResults)
            existingResults.remove()
        }
        
        // Reset main element
        if (main) {
            main.innerHTML = ''
            main.className = ''
        }
        
        // Reset instance properties
        this.quizElement = null
        this.questionsSliderElement = null
        this.nextQuestionButton = null
        this.timerElement = null
        this.currentQuestionBulletElement = null
                
        // ✅ FIX: Return to introduction screen instead of quiz
        await this.showIntroductionScreen()
    }
    
    /**
     * Shows the introduction screen with smooth transition
     */
    async showIntroductionScreen() {
        const main = document.querySelector('main')
        if (!main) return
        
        // Create introduction section
        const introduction = document.createElement('section')
        introduction.id = 'introduction'
        
        introduction.innerHTML = `
            <h1>Welcome Back to the Quest!</h1>
            <p>Ready to test your knowledge again?</p>
            <button id="start-button">Start Quiz</button>
        `
        
        // Add to DOM
        main.appendChild(introduction)
        
        // Animate in
        await TransitionUtils.bounceIn(introduction)
        
        // Setup event listener for start button
        const startButton = document.getElementById('start-button')
        if (startButton) {
            // ✅ Focus on start button for screen reader accessibility
            setTimeout(() => {
                startButton.focus()
                
                // Update screen reader with introduction message
                const screenReaderOutput = document.getElementById('sr-output')
                if (screenReaderOutput) {
                    screenReaderOutput.textContent = 'Press Start Quiz button to begin a new quiz.'
                }
            }, 200) // Small delay after animation
            
            startButton.addEventListener('click', async () => {
                
                // Add loading state
                startButton.disabled = true
                startButton.textContent = '🎯 Starting Quiz...'
                
                try {
                    // Fade out introduction
                    await TransitionUtils.fadeOut(introduction)
                    introduction.remove()
                    
                    // Start quiz
                    this.initiate()
                    this.setQuestionsSliderElement()
                    this.setNextQuestionButton()
                    this.setTimerElement()
                    
                    // Start timer immediately - quiz has its own natural transitions
                    this.startCounter()
                                        
                } catch (error) {
                    console.error('❌ Error restarting quiz:', error)
                    startButton.disabled = false
                    startButton.textContent = 'Start Quiz'
                }
            })
        }
    }
}