
  document.addEventListener("DOMContentLoaded", () => {
    // Chargement des éléments
    const profilePic = document.getElementById("profile-picture");
    const profileUsername = document.getElementById("profile-username");
    const infoForm = document.getElementById("info-form");
    const inputBgFile = document.getElementById("input-bg-file");
    const banner = document.getElementById("banner-image");
    const inputProfileImageFile = document.getElementById("input-profile-image-file");
    const inputProfileImageUrl = document.getElementById("input-profile-image");

    // Chargement de l'utilisateur depuis le localStorage
    let user = JSON.parse(localStorage.getItem("user")) || {
      pseudo: "NarutoFan",
      anime: "Naruto",
      character: "Sasuke",
      profileImage: "https://via.placeholder.com/140?text=User",
      bgImage: ""
    };

    function updateProfileDisplay() {
      profileUsername.textContent = user.pseudo || "Pseudo";
      profilePic.src = user.profileImage || "https://via.placeholder.com/140?text=Profil";

      if (user.bgImage) {
        banner.style.backgroundImage = `url('${user.bgImage}')`;
        banner.style.backgroundSize = 'cover';
        banner.style.backgroundPosition = 'center';
      } else {
        banner.style.backgroundImage = "";
      }
    }

    function fillForm() {
      if (!infoForm) return;
      if (infoForm.elements["pseudo"]) infoForm.elements["pseudo"].value = user.pseudo || "";
      if (infoForm.elements["anime"]) infoForm.elements["anime"].value = user.anime || "";
      if (infoForm.elements["character"]) infoForm.elements["character"].value = user.character || "";
      if (infoForm.elements["profileImage"]) infoForm.elements["profileImage"].value = user.profileImage || "";
    }

    if (inputProfileImageFile) {
      inputProfileImageFile.addEventListener("change", () => {
        const file = inputProfileImageFile.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            user.profileImage = e.target.result;
            profilePic.src = user.profileImage;
            if (infoForm.elements["profileImage"]) infoForm.elements["profileImage"].value = "";
            localStorage.setItem("user", JSON.stringify(user));
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (inputProfileImageUrl) {
      inputProfileImageUrl.addEventListener("input", () => {
        const url = inputProfileImageUrl.value.trim();
        if (url) {
          user.profileImage = url;
          profilePic.src = url;
          if (inputProfileImageFile) inputProfileImageFile.value = "";
          localStorage.setItem("user", JSON.stringify(user));
        }
      });
    }

    if (inputBgFile) {
      inputBgFile.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const imgData = e.target.result;
            banner.style.backgroundImage = `url('${imgData}')`;
            banner.style.backgroundSize = 'cover';
            banner.style.backgroundPosition = 'center';

            user.bgImage = imgData;
            localStorage.setItem("user", JSON.stringify(user));
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (infoForm) {
      infoForm.addEventListener("submit", e => {
        e.preventDefault();

        const newPseudo = infoForm.elements["pseudo"].value.trim();
        const newAnime = infoForm.elements["anime"].value.trim();
        const newCharacter = infoForm.elements["character"].value.trim();
        const newProfileImage = infoForm.elements["profileImage"].value.trim();

        if (!newPseudo) {
          alert("Le pseudo est obligatoire.");
          return;
        }

        user.pseudo = newPseudo;
        user.anime = newAnime;
        user.character = newCharacter;

        if (newProfileImage) {
          user.profileImage = newProfileImage;
        }

        localStorage.setItem("user", JSON.stringify(user));
        updateProfileDisplay();
        fillForm();
        alert("Informations mises à jour !");
      });
    }


    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");

        window.location.href = "index.html"; 
      });
    }

    updateProfileDisplay();
    fillForm();
  });
