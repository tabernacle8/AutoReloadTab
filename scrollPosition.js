// scrollPosition.js
window.addEventListener('scroll', function() {
    // Save scroll position in localStorage
    localStorage.setItem('scrollPosition', window.scrollY);
}, false);

window.addEventListener('load', function() {
    // Check localStorage for saved scroll position
    if (localStorage.getItem('scrollPosition')) {
        // Scroll to saved position
        window.scrollTo(0, localStorage.getItem('scrollPosition'));
    }
}, false);
