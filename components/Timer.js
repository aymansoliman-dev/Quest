export default class Timer {
    render() {
        const timer = document.createElement('p');
        timer.id = 'timer';
        timer.innerHTML = `<span>30</span><span class="lower-case">s</span> left`;

        return timer;
    }
}