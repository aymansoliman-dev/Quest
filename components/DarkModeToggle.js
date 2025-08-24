export default class DarkModeToggle {
    constructor() {
        this.toggle = this.toggle.bind(this)
        this.darkModeToggleElement = null
    }

    render() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'dark-mode-toggle';
        toggleButton.tabIndex = -1;
        toggleButton.appendChild(document.createTextNode('🌙'));
        // tooltip
        const toggleButtonTooltip = document.createElement('span');
        toggleButtonTooltip.className = 'tooltip';
        toggleButtonTooltip.textContent = document.documentElement.getAttribute('theme') === 'dark' ? 'Light Mode' : 'Dark Mode';
        toggleButton.appendChild(toggleButtonTooltip);

        this.darkModeToggleElement = toggleButton;
        toggleButton.addEventListener('click', this.toggle)

        return toggleButton;
    }

    toggle() {
        if (document.documentElement.getAttribute('theme') === 'dark') {
            document.documentElement.setAttribute('theme', 'light');
            window.localStorage.setItem('theme', 'light');

            this.darkModeToggleElement.firstChild.textContent = '🌙';
            this.darkModeToggleElement.firstElementChild.textContent = 'Dark Mode';
        } else {
            document.documentElement.setAttribute('theme', 'dark');
            window.localStorage.setItem('theme', 'dark');

            this.darkModeToggleElement.firstChild.textContent = '☀️';
            this.darkModeToggleElement.firstElementChild.textContent = 'Light Mode';
        }
    }
}