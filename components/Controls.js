import FlowStateManagers from './FlowStateManagers.js'

export default class Controls {
    constructor(numberOfQuestions) {
        this.numberOfStatusBullets = numberOfQuestions
    }

    render() {
        const controls = document.createElement('div')
        controls.id = 'quiz__controls'

        controls.appendChild(new FlowStateManagers().render(this.numberOfStatusBullets))

        return controls
    }
}