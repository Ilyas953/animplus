// Configuration Supabase
const SUPABASE_URL = 'https://cweoxurrqwfkndnmxqou.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZW94dXJycXdma25kbm14cW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTQzNDUsImV4cCI6MjA2NDk3MDM0NX0.us4kMBsKeH7wzqjMlDn8oyq0igGv9jpvqyU9sN17Dic';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Fonction de vérification des éléments DOM
function checkRequiredElements() {
    const requiredElements = [
        'login-popup',
        'popup-title',
        'login-form',
        'register-step1',
        'register-step2',
        'register-step3',
        'login-username',
        'login-password',
        'register-username',
        'anime-select',
        'character-select-1',
        'character-select-2',
        'character-select-3',
        'character-select-4',
        'profile-pictures',
        'profile-next-btn',
        'character-error',
        'switch-to-register',
        'switch-to-login'
    ];
    
    const missingElements = [];
    const foundElements = [];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            missingElements.push(id);
        } else {
            foundElements.push(id);
        }
    });
    
    if (missingElements.length > 0) {
        return false;
    }
    
    return true;
}

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
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        return null;
    }
    return data;
}

async function signUp(username, characters) {
    try {
        // Vérifier si l'identifiant existe déjà
        const { data: existingUsers, error: searchError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username);

        if (searchError) throw searchError;

        if (existingUsers && existingUsers.length > 0) {
            throw new Error('Cet identifiant est déjà utilisé');
        }

        // Utiliser l'image de profil sélectionnée ou une image par défaut
        const profileImage = selectedProfileImage || 'https://i.imgur.com/6VBx3io.png';

        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    username: username,
                    character: characters,
                    profile_image: profileImage,
                    favorite_anime: 'Naruto',
                    background_image: '' // Image de fond vide par défaut
                }
            ])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        throw error;
    }
}

async function signIn(username, characters) {
    try {
        const characterArray = characters.split(',');
        const characterLower = characterArray.map(char => char.toLowerCase());
        
        const { data: users, error: searchError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username);

        if (searchError) throw searchError;
        
        if (!users || users.length === 0) {
            throw new Error('Nom d\'utilisateur ou personnages incorrects');
        }
        
        const user = users.find(u => {
            const userCharacters = u.character.split(',').map(char => char.toLowerCase());
            return userCharacters.every(char => characterLower.includes(char));
        });
        
        if (!user) {
            throw new Error('Nom d\'utilisateur ou personnages incorrects');
        }
        
        localStorage.setItem('userId', user.id);
        localStorage.setItem('username', user.username);
        localStorage.setItem('profileImage', user.profile_image || 'https://i.imgur.com/6VBx3io.png');
        localStorage.setItem('backgroundImage', user.background_image || '');
        localStorage.setItem('favoriteAnime', user.favorite_anime);
        localStorage.setItem('character', user.character);
        
        return user;
    } catch (error) {
        throw error;
    }
}

async function signOut() {
    try {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('profileImage');
        localStorage.removeItem('backgroundImage');
        localStorage.removeItem('favoriteAnime');
        localStorage.removeItem('character');
        window.location.href = 'Index.html';
    } catch (error) {
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
    document.getElementById('register-step1').classList.add('hidden');
    document.getElementById('register-step2').classList.add('hidden');
    document.getElementById('register-step3').classList.add('hidden');
}

function showRegisterStep1() {
    document.getElementById('popup-title').textContent = 'Inscription - étape 1 pseudo';
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-step1').classList.remove('hidden');
    document.getElementById('register-step2').classList.add('hidden');
    document.getElementById('register-step3').classList.add('hidden');
}

async function goToStep2() {
    const username = document.getElementById('register-username').value.trim();
    if (!username) {
        alert('Veuillez entrer un pseudo');
        return;
    }
    
    // Afficher un indicateur de chargement
    const submitButton = document.querySelector('#register-step1 .btn-submit');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Vérification...';
    submitButton.disabled = true;
    
    try {
        // Vérifier si l'identifiant existe déjà
        const { data: existingUsers, error: searchError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username);

        if (searchError) {
            throw searchError;
        }

        if (existingUsers && existingUsers.length > 0) {
            // L'identifiant existe déjà
            alert('Cet identifiant est déjà utilisé. Veuillez en choisir un autre.');
            document.getElementById('register-username').focus();
            return;
        }
        
        // L'identifiant est disponible, passer à l'étape 2
        document.getElementById('popup-title').textContent = 'Inscription - étape 2 photo de profil';
        document.getElementById('register-step1').classList.add('hidden');
        document.getElementById('register-step2').classList.remove('hidden');
        document.getElementById('register-step3').classList.add('hidden');
        loadProfilePictures();
        
    } catch (error) {
        alert('Erreur lors de la vérification de l\'identifiant: ' + error.message);
    } finally {
        // Restaurer le bouton
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
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
    const selectedAnime = animeSelect.value;
    const characterSelects = [
        document.getElementById('character-select-1'),
        document.getElementById('character-select-2'),
        document.getElementById('character-select-3'),
        document.getElementById('character-select-4')
    ];

    // Réinitialiser tous les sélecteurs
    characterSelects.forEach(select => {
        select.innerHTML = '<option value="">Choisissez un personnage</option>';
        select.disabled = !selectedAnime;
    });

    if (selectedAnime) {
        const characters = charactersByAnime[selectedAnime];
        characterSelects.forEach(select => {
            characters.forEach(character => {
                const option = document.createElement('option');
                option.value = character;
                option.textContent = character;
                select.appendChild(option);
            });
        });
    }
}

function updateSelectedCharacters() {
    // On ne fait plus rien ici, on vérifie tout au moment du clic
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
    const characterSelects = [
        document.getElementById('character-select-1'),
        document.getElementById('character-select-2'),
        document.getElementById('character-select-3'),
        document.getElementById('character-select-4')
    ];

    const selectedCharacters = characterSelects.map(select => select.value);
    const uniqueCharacters = new Set(selectedCharacters.filter(char => char !== ''));

    // Vérification au moment du clic
    if (uniqueCharacters.size !== 4) {
        const errorMessage = document.getElementById('character-error');
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 1500);
        return;
    }

    // Afficher un indicateur de chargement
    const submitButton = document.querySelector('#register-step3 .btn-submit');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Création du compte...';
    submitButton.disabled = true;

    try {
        // Créer le compte
        const userData = await signUp(username, selectedCharacters.join(','));
        
        if (userData) {
            // Connecter automatiquement l'utilisateur
            try {
                const user = await signIn(username, selectedCharacters.join(','));
                if (user) {
                    // Fermer le popup et mettre à jour l'interface
                    closePopup();
                    updateLoginButton();
                    
                    // Afficher un message de succès
                    alert('Compte créé avec succès ! Vous êtes maintenant connecté.');
                    
                    // Rediriger vers la page d'accueil
                    window.location.href = 'Accueil.html';
                }
            } catch (loginError) {
                alert('Compte créé avec succès ! Veuillez vous connecter manuellement.');
                closePopup();
                window.location.href = 'Accueil.html';
            }
        }
    } catch (error) {
        alert(error.message);
    } finally {
        // Restaurer le bouton
        submitButton.textContent = originalText;
        submitButton.disabled = false;
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
    document.getElementById('character-select-1').value = '';
    document.getElementById('character-select-2').value = '';
    document.getElementById('character-select-3').value = '';
    document.getElementById('character-select-4').value = '';
    document.getElementById('character-select-1').disabled = true;
    document.getElementById('character-select-2').disabled = true;
    document.getElementById('character-select-3').disabled = true;
    document.getElementById('character-select-4').disabled = true;
    
    // Réinitialiser la sélection d'image de profil
    selectedProfileImage = null;
    document.querySelectorAll('.profile-pic').forEach(img => {
        img.classList.remove('selected');
    });
    document.getElementById('profile-next-btn').disabled = true;
    
    // Masquer le message d'erreur
    const errorElement = document.getElementById('character-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    // Supprimer les messages de validation d'identifiant
    removeUsernameValidationMessage();
}

// Initialisation
function initializeConnexion() {
    // Vérifier que tous les éléments requis sont présents
    if (!checkRequiredElements()) {
        return;
    }
    
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
    
    // Ajouter la validation en temps réel pour l'identifiant
    const usernameInput = document.getElementById('register-username');
    if (usernameInput) {
        let timeoutId;
        usernameInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            const username = e.target.value.trim();
            
            // Supprimer les messages d'erreur précédents
            removeUsernameValidationMessage();
            
            if (username.length >= 3) {
                // Attendre 500ms après que l'utilisateur arrête de taper
                timeoutId = setTimeout(() => {
                    checkUsernameAvailability(username);
                }, 500);
            }
        });
    }
}

// Essayer plusieurs méthodes pour s'assurer que le DOM est chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConnexion);
} else {
    // Le DOM est déjà chargé
    setTimeout(initializeConnexion, 100);
}

// Essayer aussi après un délai plus long au cas où
setTimeout(() => {
    if (!document.getElementById('login-popup')) {
        initializeConnexion();
    }
}, 500);

// Fonctions de validation en temps réel
async function checkUsernameAvailability(username) {
    try {
        const { data: existingUsers, error: searchError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username);

        if (searchError) {
            throw searchError;
        }

        if (existingUsers && existingUsers.length > 0) {
            showUsernameValidationMessage('Cet identifiant est déjà utilisé', 'error');
        } else {
            showUsernameValidationMessage('Cet identifiant est disponible', 'success');
        }
    } catch (error) {
        showUsernameValidationMessage('Erreur lors de la vérification', 'error');
    }
}

function showUsernameValidationMessage(message, type) {
    removeUsernameValidationMessage();
    
    const usernameInput = document.getElementById('register-username');
    const messageDiv = document.createElement('div');
    messageDiv.id = 'username-validation-message';
    messageDiv.style.marginTop = '5px';
    messageDiv.style.fontSize = '12px';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'error') {
        messageDiv.style.color = '#e74c3c';
    } else {
        messageDiv.style.color = '#27ae60';
    }
    
    messageDiv.textContent = message;
    
    // Insérer le message après le champ de saisie
    usernameInput.parentNode.insertBefore(messageDiv, usernameInput.nextSibling);
}

function removeUsernameValidationMessage() {
    const existingMessage = document.getElementById('username-validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Fonctions pour gérer les images sur le serveur
async function updateProfileImage(userId, newProfileImage) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ profile_image: newProfileImage })
            .eq('id', userId)
            .select();

        if (error) throw error;
        
        // Mettre à jour le localStorage
        localStorage.setItem('profileImage', newProfileImage);
        
        return data[0];
    } catch (error) {
        throw error;
    }
}

async function updateBackgroundImage(userId, newBackgroundImage) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ background_image: newBackgroundImage })
            .eq('id', userId)
            .select();

        if (error) throw error;
        
        // Mettre à jour le localStorage
        localStorage.setItem('backgroundImage', newBackgroundImage);
        
        return data[0];
    } catch (error) {
        throw error;
    }
}

async function updateUserInfo(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select();

        if (error) throw error;
        
        // Mettre à jour le localStorage
        if (updates.username) localStorage.setItem('username', updates.username);
        if (updates.favorite_anime) localStorage.setItem('favoriteAnime', updates.favorite_anime);
        if (updates.character) localStorage.setItem('character', updates.character);
        
        return data[0];
    } catch (error) {
        throw error;
    }
}

// Fonctions pour gérer les favoris et la watchlist
async function addToFavorites(animeId, animeTitle, animeImage) {
    try {
        // Utiliser l'adaptateur si disponible, sinon utiliser la méthode originale
        if (typeof tableAdapter !== 'undefined') {
            return await tableAdapter.addToFavorites(animeId, animeTitle, animeImage);
        }
        
        // Méthode de fallback
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Vous devez être connecté pour ajouter aux favoris');
            return false;
        }

        // Vérifier si l'anime est déjà dans les favoris
        const { data: existing, error: checkError } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', userId)
            .eq('anime_id', animeId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existing) {
            alert('Cet anime est déjà dans vos favoris');
            return false;
        }

        const { error } = await supabase
            .from('favorites')
            .insert([
                {
                    user_id: userId,
                    anime_id: animeId,
                    anime_title: animeTitle,
                    anime_image: animeImage
                }
            ]);

        if (error) throw error;

        alert('Anime ajouté aux favoris !');
        return true;
    } catch (error) {
        alert('Erreur lors de l\'ajout aux favoris: ' + error.message);
        return false;
    }
}

async function addToWatchlist(animeId, animeTitle, animeImage) {
    try {
        // Utiliser l'adaptateur si disponible, sinon utiliser la méthode originale
        if (typeof tableAdapter !== 'undefined') {
            return await tableAdapter.addToWatchlist(animeId, animeTitle, animeImage);
        }
        
        // Méthode de fallback
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Vous devez être connecté pour ajouter à votre liste');
            return false;
        }

        // Vérifier si l'anime est déjà dans la watchlist
        const { data: existing, error: checkError } = await supabase
            .from('watchlist')
            .select('*')
            .eq('user_id', userId)
            .eq('anime_id', animeId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existing) {
            alert('Cet anime est déjà dans votre liste');
            return false;
        }

        const { error } = await supabase
            .from('watchlist')
            .insert([
                {
                    user_id: userId,
                    anime_id: animeId,
                    anime_title: animeTitle,
                    anime_image: animeImage
                }
            ]);

        if (error) throw error;

        alert('Anime ajouté à votre liste !');
        return true;
    } catch (error) {
        alert('Erreur lors de l\'ajout à la liste: ' + error.message);
        return false;
    }
}

async function removeFromFavorites(animeId) {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Vous devez être connecté pour effectuer cette action');
            return false;
        }

        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('id', animeId)
            .eq('user_id', userId);

        if (error) throw error;

        alert('Anime retiré des favoris !');
        return true;
    } catch (error) {
        alert('Erreur lors de la suppression');
        return false;
    }
}

async function removeFromWatchlist(animeId) {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Vous devez être connecté pour effectuer cette action');
            return false;
        }

        const { error } = await supabase
            .from('watchlist')
            .delete()
            .eq('id', animeId)
            .eq('user_id', userId);

        if (error) throw error;

        alert('Anime retiré de votre liste !');
        return true;
    } catch (error) {
        alert('Erreur lors de la suppression');
        return false;
    }
}
