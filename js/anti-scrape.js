// Anti-scraping and protection measures
document.addEventListener('DOMContentLoaded', () => {
    // Prevent right-click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        alert('Right-click disabled to protect content');
    });
    
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Disable Ctrl+U, Ctrl+S, Ctrl+C, etc.
        if (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 67)) {
            e.preventDefault();
            alert('This action is not allowed');
        }
    });
    
    // Detect iframe embedding
    if (window.self !== window.top) {
        document.body.innerHTML = '<h1 style="color:red">This page cannot be embedded in iframes</h1>';
    }
    
    // Obfuscate sensitive code
    const sensitiveElements = ['phone', 'count', 'bombBtn'];
    sensitiveElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute('data-custom-id', Math.random().toString(36).substr(2, 8));
        }
    });
    
    // Detect DevTools opening
    let devtools = /./;
    devtools.toString = function() {
        document.body.innerHTML = '<h1 style="color:red">Developer Tools detected</h1>';
        return '';
    };
    console.log('%c', devtools);
});

// Code obfuscation wrapper
(function() {
    // This wrapper makes code harder to read for scrapers
    const realFetch = window.fetch;
    window.fetch = function(url, options) {
        // Add anti-scraping headers to all requests
        if (!options) options = {};
        if (!options.headers) options.headers = {};
        options.headers['X-Protected-By'] = 'SMSBomber';
        return realFetch.apply(this, arguments);
    };
})();
