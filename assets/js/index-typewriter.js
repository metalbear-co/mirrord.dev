window.addEventListener('DOMContentLoaded', (event) => {
    new Typewriter('#typewriter', {
        strings: ['easy', 'fast', 'safe'],
        autoStart: true,
        loop: true,
        pausefor: 4000,
        cursor: '_',
    });
});
