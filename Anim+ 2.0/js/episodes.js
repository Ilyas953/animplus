const cards = document.querySelectorAll(".card");
const popup = document.getElementById("video-popup");
const iframe = document.getElementById("video-frame");
const closeBtn = document.querySelector(".close-btn");

cards.forEach((card) => {
  const videoUrl = card.getAttribute("data-video");
  if (videoUrl) {
    card.addEventListener("click", () => {
      iframe.src = videoUrl;
      popup.style.display = "flex";
    });
  }
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  iframe.src = "";
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    popup.style.display = "none";
    iframe.src = "";
  }
});



