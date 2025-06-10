// Configuration Supabase
const SUPABASE_URL = 'https://cweoxurrqwfkndnmxqou.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZW94dXJycXdma25kbm14cW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTQzNDUsImV4cCI6MjA2NDk3MDM0NX0.us4kMBsKeH7wzqjMlDn8oyq0igGv9jpvqyU9sN17Dic';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Données pour l'interface
const charactersByAnime = {
    snk: ['Eren Yeager', 'Mikasa Ackerman', 'Armin Arlert', 'Levi Ackerman'],
    onepiece: ['Monkey D. Luffy', 'Roronoa Zoro', 'Nami', 'Sanji'],
    bleach: ['Ichigo Kurosaki', 'Rukia Kuchiki', 'Renji Abarai', 'Orihime Inoue'],
    mha: ['Izuku Midoriya', 'Katsuki Bakugo', 'Ochaco Uraraka', 'Shoto Todoroki'],
    naruto: ['Naruto Uzumaki', 'Sasuke Uchiha', 'Sakura Haruno', 'Kakashi Hatake'],
    dragonball: ['Son Goku', 'Vegeta', 'Gohan', 'Piccolo']
};

const profileImages = [
    'assets/img/PHOTO DE PROFIL ANIMECOMPTE/kakashiphotoprofil.jpg',
    'assets/img/PHOTO DE PROFIL ANIMECOMPTE/dekuphotoprofil.jfif',
    'assets/img/PHOTO DE PROFIL ANIMECOMPTE/luffy2.0photoprofil.jpg',
    'assets/img/PHOTO DE PROFIL ANIMECOMPTE/NarutopetitPhotoprofil.jpg',
    'assets/img/PHOTO DE PROFIL ANIMECOMPTE/Sungjinwoophotoprofil.webp',
    'assets/img/PHOTO DE PROFIL ANIMECOMPTE/zorophotoprofil.jpg',
    'assets/img/PHOTO DE PROFIL ANIMECOMPTE/ichigophotoprofil.webp',
    'assets/img/PHOTO DE PROFIL ANIMECOMPTE/erenphotoprofil.jpg'
];

let selectedProfileImage = null;

// Fonctions d'authentification
async function checkAuth() {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        return null;
    }
    return data;
}

async function signUp(username, character) {
    try {
        // Vérifier si le nom d'utilisateur existe déjà
        const { data: existingUser } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            throw new Error('Ce nom d\'utilisateur est déjà pris');
        }

        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    username: username,
                    character: character,
                    profile_image: selectedProfileImage,
                    favorite_anime: document.getElementById('anime-select').value
                }
            ])
            .select()
            .single();

        if (error) throw error;
        
        // Stocker les informations dans le localStorage
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('profileImage', data.profile_image);
        localStorage.setItem('favoriteAnime', data.favorite_anime);
        localStorage.setItem('character', data.character);
        
        // Vérifier que l'utilisateur est bien connecté
        const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.id)
            .single();

        if (!userData) {
            throw new Error('Erreur lors de la création du compte');
        }
        
        return userData;
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error.message);
        throw error;
    }
}

async function signIn(username, character) {
    try {
        // Convertir le personnage en minuscules pour la comparaison
        const characterLower = character.toLowerCase();
        
        // Vérifier d'abord si l'utilisateur existe
        const { data: users, error: searchError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username);

        if (searchError) throw searchError;
        
        // Vérifier si nous avons trouvé l'utilisateur
        if (!users || users.length === 0) {
            throw new Error('Nom d\'utilisateur ou personnage incorrect');
        }
        
        // Trouver l'utilisateur dont le personnage correspond (sans tenir compte de la casse)
        const user = users.find(u => u.character.toLowerCase() === characterLower);
        
        if (!user) {
            throw new Error('Nom d\'utilisateur ou personnage incorrect');
        }
        
        // Stocker les informations dans le localStorage
        localStorage.setItem('userId', user.id);
        localStorage.setItem('username', user.username);
        localStorage.setItem('profileImage', user.profile_image);
        localStorage.setItem('favoriteAnime', user.favorite_anime);
        localStorage.setItem('character', user.character);
        
        return user;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error.message);
        throw error;
    }
}

async function signOut() {
    try {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('profileImage');
        localStorage.removeItem('favoriteAnime');
        localStorage.removeItem('character');
        window.location.href = 'Index.html';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
        throw error;
    }
}

// Fonctions UI
function openPopup() {
    document.getElementById('login-popup').classList.remove('hidden');
    showLoginForm();
}

function closePopup() {
    document.getElementById('login-popup').classList.add('hidden');
    resetAll();
}

function showLoginForm() {
    document.getElementById('popup-title').textContent = 'Connecte-toi à ton compte';
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegisterStep1() {
    document.getElementById('popup-title').textContent = 'Inscription - étape 1 pseudo';
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('register-step1').classList.remove('hidden');
    document.getElementById('register-step2').classList.add('hidden');
    document.getElementById('register-step3').classList.add('hidden');
}

function goToStep2() {
    const username = document.getElementById('register-username').value.trim();
    if (!username) {
        alert('Veuillez entrer un pseudo');
        return;
    }
    document.getElementById('popup-title').textContent = 'Inscription - étape 2 photo de profil';
    document.getElementById('register-step1').classList.add('hidden');
    document.getElementById('register-step2').classList.remove('hidden');
    document.getElementById('register-step3').classList.add('hidden');
    loadProfilePictures();
}

function goToStep3() {
    if (!selectedProfileImage) {
        alert('Veuillez sélectionner une image de profil');
        return;
    }
    document.getElementById('popup-title').textContent = 'Inscription - étape 3 anime et personnage';
    document.getElementById('register-step1').classList.add('hidden');
    document.getElementById('register-step2').classList.add('hidden');
    document.getElementById('register-step3').classList.remove('hidden');
}

function loadProfilePictures() {
    const container = document.getElementById('profile-pictures');
    container.innerHTML = '';
    profileImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Profil ${index + 1}`;
        img.classList.add('profile-pic');
        img.onclick = () => selectProfilePicture(src, img);
        container.appendChild(img);
    });
}

function selectProfilePicture(src, imgElement) {
    selectedProfileImage = src;
    document.querySelectorAll('.profile-pic').forEach(img => {
        img.classList.remove('selected');
    });
    imgElement.classList.add('selected');
    document.getElementById('profile-next-btn').disabled = false;
}

function updateCharacterOptions() {
    const animeSelect = document.getElementById('anime-select');
    const characterSelect = document.getElementById('character-select');
    const selectedAnime = animeSelect.value;

    characterSelect.innerHTML = '<option value="">Choisissez un personnage</option>';
    characterSelect.disabled = !selectedAnime;

    if (selectedAnime) {
        charactersByAnime[selectedAnime].forEach(character => {
            const option = document.createElement('option');
            option.value = character;
            option.textContent = character;
            characterSelect.appendChild(option);
        });
    }
}

async function submitLogin() {
    const username = document.getElementById('login-username').value.trim();
    const character = document.getElementById('login-password').value.trim();

    if (!username || !character) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    try {
        const user = await signIn(username, character);
        if (user) {
            closePopup();
            updateLoginButton();
            window.location.href = 'Accueil.html';
        }
    } catch (error) {
        alert('Erreur de connexion: ' + error.message);
    }
}

async function submitRegister() {
    const username = document.getElementById('register-username').value.trim();
    const character = document.getElementById('character-select').value.trim();
    const anime = document.getElementById('anime-select').value;

    if (!username || !character || !anime || !selectedProfileImage) {
        alert('Veuillez remplir tous les champs et sélectionner une image de profil');
        return;
    }

    try {
        const user = await signUp(username, character);
        if (user) {
            // Mettre à jour l'interface
            updateLoginButton();
            // Fermer la popup
            closePopup();
            // Rediriger vers la page d'accueil
            window.location.href = 'Accueil.html';
        }
    } catch (error) {
        alert('Erreur lors de l\'inscription: ' + error.message);
    }
}

async function updateLoginButton() {
    const loginButton = document.getElementById('login-button');
    if (!loginButton) return;

    const username = localStorage.getItem('username');
    if (username) {
        loginButton.textContent = username;
        loginButton.onclick = () => {
            window.location.href = 'profile.html';
        };
    } else {
        loginButton.textContent = 'Connexion';
        loginButton.onclick = openPopup;
    }
}

function resetAll() {
    // Réinitialiser les champs de formulaire
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('register-username').value = '';
    document.getElementById('anime-select').value = '';
    document.getElementById('character-select').value = '';
    document.getElementById('character-select').disabled = true;
    
    // Réinitialiser la sélection d'image de profil
    selectedProfileImage = null;
    document.querySelectorAll('.profile-pic').forEach(img => {
        img.classList.remove('selected');
    });
    document.getElementById('profile-next-btn').disabled = true;
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier l'état de connexion au chargement
    checkAuth().then(user => {
        if (user) {
            updateLoginButton();
        }
    });

    // Ajouter les écouteurs d'événements
    document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterStep1();
    });

    document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
});
