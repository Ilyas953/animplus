document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll('.slider .list .item');
    const thumbnails = document.querySelectorAll('.thumbnail .item');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const sliderContainer = document.querySelector('.slider .list');

    let totalItems = items.length;
    let currentIndex = 0;
    let autoSlideInterval;


document.addEventListener('click', function (e) {
    const target = e.target.closest('a');
    if (target && target.getAttribute('href') === '#') {
        e.preventDefault();
    }
});
 
    function updateSlider() {
        document.querySelector('.slider .list .item.active')?.classList.remove('active');
        document.querySelector('.thumbnail .item.active')?.classList.remove('active');

        items[currentIndex].classList.add('active');
        thumbnails[currentIndex].classList.add('active');

        scrollThumbnailIntoView();

  
    }

    function goNext() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateSlider();
    }

    function goPrev() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateSlider();
    }

    function scrollThumbnailIntoView() {
        const activeThumb = document.querySelector('.thumbnail .item.active');
        if (!activeThumb) return;


        activeThumb.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'  
        });
    }


    nextBtn.addEventListener('click', e => {
        e.preventDefault();
        goNext();
    });

    prevBtn.addEventListener('click', e => {
        e.preventDefault();
        goPrev();
    });




    let startX = 0;
    let isDragging = false;

    sliderContainer.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    sliderContainer.addEventListener('touchmove', e => {
        const deltaX = e.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 50) {
            deltaX < 0 ? goNext() : goPrev();
            startX = 0;
        }
    }, { passive: true });

    sliderContainer.addEventListener('touchend', () => {
        startX = 0;
    });


    sliderContainer.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX;
    });

    sliderContainer.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 50) {
            deltaX < 0 ? goNext() : goPrev();
            isDragging = false;
        }
    });

    sliderContainer.addEventListener('mouseup', () => {
        isDragging = false;
    });

    sliderContainer.addEventListener('mouseleave', () => {
        isDragging = false;
    });


    updateSlider();
});














const initSliderrs = () => {
  const sliders = document.querySelectorAll(".sliderrs-container");

  sliders.forEach((slider) => {
    const list = slider.querySelector(".sliderrs-list");
    const prevBtn = slider.querySelector(".prev-slide");
    const nextBtn = slider.querySelector(".next-slide");

    const scrollAmount = 300;

    prevBtn?.addEventListener("click", () => {
      list.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    nextBtn?.addEventListener("click", () => {
      list.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  });
};

window.addEventListener("load", initSliderrs);










