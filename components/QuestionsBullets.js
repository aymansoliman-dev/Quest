export default class QuestionsBullets {
    render(numberOfStatusBullets) {
        const questionsBullets = document.createElement('div');
        questionsBullets.id = 'questions-status';

        for (let i = 1; i <= numberOfStatusBullets; i++) {
            const questionBullet = document.createElement('span');
            questionBullet.id = `${i}`;
            questionBullet.className = 'question-status';
            questionsBullets.appendChild(questionBullet);
        }

        return questionsBullets;
    }
}