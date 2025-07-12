let lastScrollTop = 0;
const navbar = document.querySelector('.navbar-bottom');

window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
 
        navbar.style.transform = 'translateY(100%)';
    } else {

        navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
});

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 10) {  // dès que tu as scrollé 10px vers le bas
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
