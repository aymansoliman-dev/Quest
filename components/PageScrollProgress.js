export default class PageScrollProgress {
    render() {
        const pageScrollProgress = document.createElement('div')
        pageScrollProgress.id = 'progress-bar'
        const fill = document.createElement('div')
        fill.id = 'progress-bar__fill'
        pageScrollProgress.appendChild(fill)
        this.addScrollListener()
        this.addScrollToTopButton()

        return pageScrollProgress
    }

    addScrollListener() {
        window.addEventListener('scroll', () => {
            const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
            document.getElementById('progress-bar__fill').style.width = `${progress * 100}%`

            if (scrollY > 900) {
                document.getElementById('scroll-to-top-button').style.opacity = '1'
                document.getElementById('scroll-to-top-button').style.transform = 'translateY(0)'
            } else {
                document.getElementById('scroll-to-top-button').style.opacity = '0'
                document.getElementById('scroll-to-top-button').style.transform = 'translateY(100%)'
            }
        })
    }

    addScrollToTopButton() {
        const scrollToTopButton = document.createElement('button')
        scrollToTopButton.id = 'scroll-to-top-button'
        scrollToTopButton.innerHTML = '⬆'
        scrollToTopButton.ariaLabel = 'Scroll to top'

        scrollToTopButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                document.getElementById('retake-quiz-button').focus()
            }
        })
        document.body.appendChild(scrollToTopButton)
    }
}