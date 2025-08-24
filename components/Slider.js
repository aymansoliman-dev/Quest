import Question from './Question.js'

export default class Slider {
    constructor() {
        this.sliderElement = null
    }

    render(questions) {
        const questionsSlider = document.createElement('div')
        questionsSlider.id = 'questions-slider'
        questionsSlider.tabIndex = -1

        questions.forEach((question, index) => {
            questionsSlider.appendChild(new Question(question, index + 1).render())
        })

        this.sliderElement = questionsSlider
        questionsSlider.__instance = this

        this.preventWheelScrolling()

        return questionsSlider
    }

    slide() {
        this.sliderElement.scrollBy({
                left: this.sliderElement.clientWidth,
                behaviour: 'smooth'
            }
        )
    }

    preventWheelScrolling() {
        this.sliderElement.addEventListener('wheel', (e) => {
            e.preventDefault()
        })
        window.addEventListener('resize', () => {
        //
        })
    }
}