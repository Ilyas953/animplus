const scrollBtn = document.getElementById('scrollToTopBtn');


window.addEventListener('scroll', () => {
  if (window.scrollY > 1200) {
    scrollBtn.style.display = 'flex';
  } else {
    scrollBtn.style.display = 'none';
  }
});


scrollBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
