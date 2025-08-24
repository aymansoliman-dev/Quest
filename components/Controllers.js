import NextQuestionButton from './NextQuestionButton.js'

export default class Controllers {
    render() {
        const controllers = document.createElement('div')
        controllers.id = 'controllers'

        controllers.appendChild(new NextQuestionButton().render())

        return controllers
    }
}