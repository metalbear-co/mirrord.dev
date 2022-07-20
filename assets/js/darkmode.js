const mode = document.getElementById('mode');

if (mode !== null) {

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {

    if (event.matches) {

      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-dark-mode', '');      

    } else {

      localStorage.setItem('theme', 'light');
      document.documentElement.removeAttribute('data-dark-mode');      

    }

  })

  mode.addEventListener('click', () => {

    document.documentElement.toggleAttribute('data-dark-mode');
    localStorage.setItem('theme', document.documentElement.hasAttribute('data-dark-mode') ? 'dark' : 'light');
    console.log(document.documentElement.hasAttribute('data-dark-mode'))
    
    var howItWorksID = document.getElementById("howItWorks");
    if (document.documentElement.hasAttribute('data-dark-mode')) {              
      howItWorksID.src = "mirrord-how-it-works-dark.svg";
    } else {      
      howItWorksID.src = "mirrord-how-it-works-light.svg";
    }
  });

  if (localStorage.getItem('theme') === 'dark') {

    document.documentElement.setAttribute('data-dark-mode', '');        

  } else {

    document.documentElement.removeAttribute('data-dark-mode');    

  }

}
