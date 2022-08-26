window.addEventListener('DOMContentLoaded', (event) => {
    new Typewriter('#typewriter', {
        strings: ['easier', 'faster', 'safer'],
        autoStart: true,
        loop: true,
        pausefor: 4000,
        cursor: '_',
    });
});
