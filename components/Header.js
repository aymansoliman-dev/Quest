import DarkModeToggle from "./DarkModeToggle.js";
import Timer from "./Timer.js";
import PageScrollProgress from "./PageScrollProgress.js";

export default class Header {
    render() {
        const header = document.createElement('header')
        const container = document.createElement('div')
        container.className = 'container'
        header.appendChild(container)
        header.appendChild(new PageScrollProgress().render())

        container.appendChild(new DarkModeToggle().render())
        container.appendChild(new Timer().render())

        return header
    }
}