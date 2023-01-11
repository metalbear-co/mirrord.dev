var themeToggleSlider = document.getElementById('theme-toggle-slider');
var themeToggleSliderMobile = document.getElementById('theme-toggle-slider-mobile');

// Change the slide inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleSlider.classList.add('dark-slider');
    themeToggleSliderMobile.classList.add('dark-slider');
} else {
    themeToggleSlider.classList.remove('dark-slider');
    themeToggleSliderMobile.classList.remove('dark-slider');
}

var themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function() {

    // toggle slider inside button
    themeToggleSlider.classList.toggle('dark-slider');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', "dark")
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.removeAttribute("data-theme")
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            document.documentElement.removeAttribute("data-theme")
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', "dark")
            localStorage.setItem('color-theme', 'dark');
        }
    }
    
});

var themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');

themeToggleBtnMobile.addEventListener('click', function() {

    // toggle slider inside button
    themeToggleSliderMobile.classList.toggle('dark-slider');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', "dark")
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.removeAttribute("data-theme")
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            document.documentElement.removeAttribute("data-theme")
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', "dark")
            localStorage.setItem('color-theme', 'dark');
        }
    }
    
});