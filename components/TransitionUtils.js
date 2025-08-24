/**
 * Transition Utilities for Quest Quiz Application
 * Provides consistent page transitions and animations
 */

export default class TransitionUtils {
    
    /**
     * Creates a smooth fade out transition
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Duration in milliseconds
     * @returns {Promise} Resolves when animation completes
     */
    static fadeOut(element, duration = 400) {
        return new Promise((resolve) => {
            element.classList.add('transitioning');
            element.classList.add('page-exit');
            
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    }
    
    /**
     * Creates a smooth fade in transition
     * @param {HTMLElement} element - Element to fade in
     * @param {string} animationType - Type of entrance animation
     * @param {number} delay - Delay before animation starts
     * @returns {Promise} Resolves when animation completes
     */
    static fadeIn(element, animationType = 'page-enter', delay = 0) {
        return new Promise((resolve) => {
            element.style.display = '';
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.classList.add(animationType);
                element.classList.remove('transitioning');
                
                // Listen for animation end
                const handleAnimationEnd = () => {
                    element.removeEventListener('animationend', handleAnimationEnd);
                    element.classList.remove(animationType);
                    
                    // ✅ FIX: Reset styles after animation completes
                    element.style.opacity = '';
                    element.style.transform = '';
                    
                    resolve();
                };
                
                element.addEventListener('animationend', handleAnimationEnd);
                
                // ✅ FIX: Fallback in case animationend doesn't fire
                setTimeout(() => {
                    if (element.classList.contains(animationType)) {
                        handleAnimationEnd();
                    }
                }, 1000);
            }, delay);
        });
    }
    
    /**
     * Slide in from right animation
     * @param {HTMLElement} element - Element to animate
     * @returns {Promise} Resolves when animation completes
     */
    static slideInRight(element) {
        return this.fadeIn(element, 'slide-in-right', 100);
    }
    
    /**
     * Slide in from left animation
     * @param {HTMLElement} element - Element to animate
     * @returns {Promise} Resolves when animation completes
     */
    static slideInLeft(element) {
        return this.fadeIn(element, 'slide-in-left', 100);
    }
    
    /**
     * Scale in animation with 3D effect
     * @param {HTMLElement} element - Element to animate
     * @returns {Promise} Resolves when animation completes
     */
    static scaleIn(element) {
        return this.fadeIn(element, 'scale-in', 150);
    }
    
    /**
     * Bounce in animation
     * @param {HTMLElement} element - Element to animate
     * @returns {Promise} Resolves when animation completes
     */
    static bounceIn(element) {
        return this.fadeIn(element, 'bounce-in', 200);
    }
    
    /**
     * Slide up animation
     * @param {HTMLElement} element - Element to animate
     * @returns {Promise} Resolves when animation completes
     */
    static slideUp(element) {
        return this.fadeIn(element, 'slide-up', 100);
    }
    
    /**
     * Creates a sequence of transitions between pages
     * @param {HTMLElement} exitElement - Element to exit
     * @param {HTMLElement} enterElement - Element to enter
     * @param {string} enterAnimation - Type of enter animation
     * @returns {Promise} Resolves when both transitions complete
     */
    static async transitionBetween(exitElement, enterElement, enterAnimation = 'slide-in-right') {
        // Exit current page
        await this.fadeOut(exitElement);
        
        // Enter new page with animation
        await this.fadeIn(enterElement, enterAnimation);
    }
    
    /**
     * Adds staggered animation to multiple elements
     * @param {NodeList|Array} elements - Elements to animate
     * @param {string} animationType - Type of animation
     * @param {number} stagger - Delay between each element
     */
    static staggerIn(elements, animationType = 'slide-up', stagger = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.fadeIn(element, animationType);
            }, index * stagger);
        });
    }
    
    /**
     * Creates a loading transition effect
     * @param {HTMLElement} element - Element to animate
     * @returns {Promise} Resolves when animation completes
     */
    static showLoading(element) {
        element.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 200px;
                font-size: 1.2rem;
                color: var(--text-color);
                gap: 1rem;
            ">
                <div style="
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--highlight-color);
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                Loading...
            </div>
        `;
        
        // Add spin animation if not already defined
        if (!document.querySelector('#spin-keyframes')) {
            const style = document.createElement('style');
            style.id = 'spin-keyframes';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        return this.fadeIn(element, 'page-enter');
    }
}
