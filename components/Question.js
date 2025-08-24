export default class Question {
    constructor(questionObject, questionNumber) {
        this.questionNumber = questionNumber
        this.questionObject = questionObject
        this.questionCorrectAnswer = this.questionObject["correct_answer"]
    }

    render() {
        const questionElement = document.createElement('div')
        questionElement.className = 'question'
        questionElement.ariaLabel = `Question ${this.questionNumber}`
        questionElement.dataset.questionNumber = this.questionNumber

        if (this.questionNumber > 1) {
            questionElement.setAttribute('inert', '')
        }

        const questionNumber = document.createElement('span')
        questionNumber.textContent = `Q${this.questionNumber}: `
        questionNumber.tabIndex = -1

        const questionTitle = document.createElement('p')
        questionTitle.innerHTML = this.questionObject.title
        questionTitle.className = 'question-title'
        questionTitle.ariaLabel = `Question ${this.questionNumber}: ${this.questionObject.title}`
        questionTitle.tabIndex = 0
        questionTitle.prepend(questionNumber)
        questionElement.appendChild(questionTitle)

        // answers
        const answersGroup = document.createElement('div')
        answersGroup.className = 'answers-group'

        this.questionObject["answers"].forEach((answer, answerIndex) => {
            const label = document.createElement('label')
            label.className = 'answer'
            label.dataset.questionNumber = answerIndex + 1
            label.setAttribute('for', `q${this.questionNumber}a${answerIndex + 1}`)
            label.setAttribute('aria-label', `answer ${answerIndex + 1}: ${answer}`)
            label.innerHTML = `
                <input type="radio" id="q${this.questionNumber}a${answerIndex + 1}" name="q${this.questionNumber}" value="${answer}">
                <span class="radio-btn"></span>
                <span>${answer}</span>
            `
            label.tabIndex = 0 // Make label focusable

            label.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    label.click()
                }
            })

            answersGroup.appendChild(label)

        })

        questionElement.__instance = this
        questionElement.appendChild(answersGroup)

        return questionElement
    }
}