export default class NextQuestionButton {
    render() {
        const nextQuestionButton = document.createElement('button')
        nextQuestionButton.id = 'next-button'
        nextQuestionButton.ariaLabel = 'next question'
        nextQuestionButton.innerHTML = 'Next Question'
        nextQuestionButton.disabled = true

        return nextQuestionButton
    }
}