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