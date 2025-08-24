import QuestionsBullets from './QuestionsBullets.js'
import Controllers from './Controllers.js'

export default class FlowStateManagers {
    render(numberOfStatusBullets) {
        const flowStateManagers = document.createElement('div')
        flowStateManagers.appendChild(new QuestionsBullets().render(numberOfStatusBullets))
        flowStateManagers.appendChild(new Controllers().render())

        return flowStateManagers
    }
}