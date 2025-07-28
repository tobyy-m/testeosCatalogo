
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const body = document.body;
            
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        body.classList.remove('loading');
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(hideLoadingScreen, 500);
    });
} else {
    setTimeout(hideLoadingScreen, 500);
}

window.addEventListener('load', function() {
    setTimeout(hideLoadingScreen, 100);
});

setTimeout(hideLoadingScreen, 2000);