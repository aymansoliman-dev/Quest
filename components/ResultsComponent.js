import TransitionUtils from './TransitionUtils.js'

export default class ResultsComponent {

    constructor(questionsSliderElement, numberOfQuestions, score, quizAppInstance = null) {
        this.questionsSliderElement = questionsSliderElement
        this.numberOfQuestions = numberOfQuestions
        this.score = score
        this.quizAppInstance = quizAppInstance
        this.percentage = this.score / this.numberOfQuestions * 100
        this.scoreElement = null
        this.percentageColor = null
    }

    render() {
        const resultsSection = document.createElement('section')
        resultsSection.id = 'results'
        resultsSection.ariaLabel = 'Results'
        resultsSection.tabIndex = -1

        const scoreElement = document.createElement('div')
        scoreElement.id = 'score'
        scoreElement.innerHTML = `<p>Score:<br><span>${this.score}</span> / ${this.numberOfQuestions}</p>`
        scoreElement.tabIndex = 0
        scoreElement.focus()
        scoreElement.ariaLabel = `You answered ${this.score} questions correctly out of ${this.numberOfQuestions} questions! Press 'Tab' to review questions and answers. Or press 'Shift Tab' to Take The Quiz Again!`
        scoreElement.role = 'score'
        this.scoreElement = scoreElement

        resultsSection.appendChild(scoreElement)

        this.percentageColor = this.percentage >= 70 ? '#63b063' : this.percentage >= 50 ? '#ff9100' : '#fc6363'

        const questionsResults = this.questionsSliderElement.cloneNode(true)
        questionsResults.id = 'questions-results'
        this.questionsResults = questionsResults
        resultsSection.appendChild(questionsResults)

        this.manageQuestionsAttributes()
        this.styleScoreElement()
        this.addRetakeButtonTo(document.querySelector('header'))

        return resultsSection
    }

    manageQuestionsAttributes() {
        this.questionsResults.querySelectorAll('.question').forEach(question => {
            question.style.display = 'block'
            question.removeAttribute('inert')
            question.querySelector('.answers-group').setAttribute('inert', '')
            question.querySelector('.question-title').ariaLabel += `The Correct Answer is: ${question.querySelector('.correct.answer input').value}!`
        })
    }

    styleScoreElement() {
        this.scoreElement.style.setProperty('--percentage-color', this.percentageColor)
        this.scoreElement.style.setProperty('--percentage-value', `${this.percentage}%`)
    }

    addRetakeButtonTo(header) {
        // Check if button already exists
        const existingButton = document.getElementById('retake-quiz-button')
        if (existingButton) {
            return
        }
        
        const retakeQuizButton = document.createElement('button')
        retakeQuizButton.id = 'retake-quiz-button'
        retakeQuizButton.ariaLabel = 'Take The Quiz Again'
        retakeQuizButton.textContent = '🔄 Retake Quiz'
        retakeQuizButton.style.cssText = `
            background: var(--custom-background);
            color: black;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        `
        
        // Add hover effect
        retakeQuizButton.addEventListener('mouseenter', () => {
            retakeQuizButton.style.transform = 'translateY(-2px)'
            retakeQuizButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
        })
        
        retakeQuizButton.addEventListener('mouseleave', () => {
            retakeQuizButton.style.transform = 'translateY(0)'
            retakeQuizButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
        })
        
        // Add click handler with transition
        retakeQuizButton.addEventListener('click', async () => {
            retakeQuizButton.disabled = true
            retakeQuizButton.textContent = '🔄 Resetting...'
            
            try {
                if (this.quizAppInstance && typeof this.quizAppInstance.resetQuiz === 'function') {
                    // Use smooth reset without page reload
                    await this.quizAppInstance.resetQuiz()
                } else {
                    // Fallback to page reload with transition
                    const resultsElement = document.getElementById('results')
                    if (resultsElement) {
                        await TransitionUtils.fadeOut(resultsElement)
                    }
                    window.location.reload()
                }
            } catch (error) {
                console.error('❌ Error resetting quiz:', error)
                // Fallback to page reload
                window.location.reload()
            }
        })
        
        const headerContainer = header.querySelector('.container')
        if (headerContainer) {
            headerContainer.appendChild(retakeQuizButton)
            
            // Animate button in
            setTimeout(() => {
                TransitionUtils.bounceIn(retakeQuizButton)
            }, 500)
        }
    }
}