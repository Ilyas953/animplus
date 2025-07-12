const animesData = [
  {
    title: "Naruto Shippuden",
    genre: "shonen",
    theme: ["action", "comedy"],
    language: "vo",
    link: "Lecteur.html",
    image: "assets/img/affiche/Naruto AFFICHE.jpg",
    year: 2011,
    category: "serie",
    id: "naruto-shippuden"
  },
  {
    title: "My Hero Academia",
    genre: "shonen",
    theme: ["action", "fantasy"],
    language: "vf",
    link: "https://exemple.com/2",
    image: "assets/img/affiche/affiche mha.jpg",
    year: 2013,
    category: "serie",
    id: "my-hero-academia"
  },
  {
    title: "Jujutsu Kaisen",
    genre: "shonen",
    theme: ["action", "fantasy"],
    language: "vo",
    link: "",
    image: "assets/img/affiche/affiche jujutsu kaisen.jpg",
    year: 2020,
    category: "anime",
    id: "jujutsu-kaisen"
  },
  {
    title: "Tokyo Revenger",
    genre: "shonen",
    theme: ["action", "drama"],
    language: "vf",
    link: "https://exemple.com/3",
    image: "assets/img/affiche/affiche tokyo revenger.webp",
    year: 2018,
    category: "anime",
    id: "tokyo-revenger"
  },
  {
    title: "Solo Leveling",
    genre: "shonen",
    theme: ["action", "fantasy"],
    language: "vo",
    link: "1-Solo-leveling-Saison-1.HTML",
    image: "assets/img/affiche/affiche solo leveling.jpg",
    year: 2024,
    category: "anime",
    id: "solo-leveling"
  }
];

const result = document.getElementById('recommendation-result');
const bot = document.getElementById('anime-bot');
const botMessage = document.getElementById('anime-bot-message');
const botInput = document.getElementById('anime-bot-input');
const userInput = document.getElementById('user-message');






function displayAnimes(animes, introText = "") {
  if (animes.length === 0) {
    result.innerHTML = `<p>Aucun anime trouvé.</p>`;
    document.getElementById('recommendation-text').style.display = 'none';
    return;
  }

  // Affiche le texte de recommandation seulement si introText est fourni
  const recommendationText = document.getElementById('recommendation-text');
  if (introText) {
    recommendationText.textContent = introText;
    recommendationText.style.display = 'flex'; // ou 'block' selon ton besoin
  } else {
    recommendationText.style.display = 'none';
  }

  // Limite max 5 animes
  const limited = animes.slice(0, 5);

  const itemsHtml = limited.map(anime => `
    <a href="${anime.link || '#'}" target="_blank" rel="noopener noreferrer" style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;text-decoration:none;color:#000;">
      <img src="${anime.image}" alt="${anime.title}" style="width:300px;height:400px;object-fit:cover;border-radius:5px;margin-bottom:10px;"/>
      <span style="font-weight:bold;font-size:1.1em;">${anime.title}</span>
    </a>
  `).join("");

result.innerHTML = `<div id="recommendation-result">${itemsHtml}</div>`;

}





document.getElementById('filter-form').addEventListener('submit', e => {
  e.preventDefault();

  const selectedGenre = e.target['main-genre'].value.toLowerCase();
  const selectedTheme = e.target.theme.value.toLowerCase();
  const selectedLanguage = e.target.language.value.toLowerCase();

  const filtered = animesData.filter(anime => {
    const animeGenre = anime.genre.toLowerCase();
    const animeThemes = anime.theme.map(t => t.toLowerCase());
    const animeLanguage = anime.language.toLowerCase();

    const genreMatch = !selectedGenre || animeGenre === selectedGenre;
    const themeMatch = !selectedTheme || animeThemes.includes(selectedTheme);
    const languageMatch = !selectedLanguage || animeLanguage === selectedLanguage;

    return genreMatch && themeMatch && languageMatch;
  });

  if (filtered.length === 0) {
    result.innerHTML = "";
    bot.style.display = "flex";
    botInput.style.display = "block";

    const messages = [
      "Hmm... je ne trouve rien. Tu veux que je t'aide ? 😅",
      "Pas de résultat... Tu pourrais essayer un autre thème ?",
      "Aucun anime trouvé, mais je peux en chercher d'autres si tu veux !",
      "Essaie d’enlever un filtre ou demande à Anim+ 😉"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    botMessage.textContent = randomMessage;
    return;
  }

  // Affiche tous les résultats jusqu'à 5 max
  displayAnimes(filtered, "Nous te recommandons :");

  bot.style.display = "none";
  botInput.style.display = "none";
});

// === Chatbot ===

function containsWord(message, word) {
  const pattern = new RegExp(`\\b${word}\\b`, "i");
  return pattern.test(message);
}

userInput.addEventListener('keydown', (e) => {
  if (e.key !== "Enter") return;

  const msg = userInput.value.toLowerCase().trim();
  if (!msg) return;

  let detectedGenre = "";
  let detectedTheme = "";
  let detectedLanguage = "";

  // Réponses simples du bot
  if (
    containsWord(msg, "salut") ||
    containsWord(msg, "bonjour") ||
    containsWord(msg, "yo") ||
    containsWord(msg, "coucou") ||
    containsWord(msg, "ça va") ||
    containsWord(msg, "ca va") ||
    containsWord(msg, "hey")
  ) {
    botMessage.textContent = "Salut à toi ! Je vais bien 😄 Tu veux que je t’aide à trouver un anime ? Dis-moi un genre, un thème ou même 'anime aléatoire'.";
    userInput.value = "";
    return;
  }

  if (
    (containsWord(msg, "comment") && (containsWord(msg, "ça va") || containsWord(msg, "tu vas"))) ||
    containsWord(msg, "ça roule") ||
    containsWord(msg, "quoi de neuf")
  ) {
    botMessage.textContent = "Ça va super bien, merci ! Prêt à te trouver un super anime ? 🎉";
    userInput.value = "";
    return;
  }

  if (
    (containsWord(msg, "quel") && containsWord(msg, "nom")) ||
    (containsWord(msg, "comment") && containsWord(msg, "appelles")) ||
    (containsWord(msg, "tu") && containsWord(msg, "appelles"))
  ) {
    botMessage.textContent = "Je suis Anim+, ton assistant perso pour trouver des animes ! 😊";
    userInput.value = "";
    return;
  }

  if (
    containsWord(msg, "merci") ||
    containsWord(msg, "thanks") ||
    containsWord(msg, "thank you")
  ) {
    botMessage.textContent = "Avec plaisir ! N’hésite pas si tu veux d’autres recommandations.";
    userInput.value = "";
    return;
  }

  if (
    (containsWord(msg, "quel") && containsWord(msg, "anime")) ||
    (containsWord(msg, "quoi") && containsWord(msg, "regarder")) ||
    (containsWord(msg, "conseiller") && containsWord(msg, "anime"))
  ) {
    botMessage.textContent = "Dis-moi quel genre ou thème tu préfères, ou demande un anime aléatoire !";
    userInput.value = "";
    return;
  }

  if (
    containsWord(msg, "bot") ||
    containsWord(msg, "humain") ||
    (containsWord(msg, "qui") && containsWord(msg, "es-tu"))
  ) {
    botMessage.textContent = "Je suis un bot créé pour t’aider à trouver ton anime parfait ! 🤖";
    userInput.value = "";
    return;
  }

  if (
    (containsWord(msg, "bonne") && (containsWord(msg, "journée") || containsWord(msg, "soirée"))) ||
    containsWord(msg, "à plus") ||
    containsWord(msg, "bye")
  ) {
    botMessage.textContent = "Bonne journée/soirée à toi aussi ! Reviens vite pour plus d’animes ! 👋";
    userInput.value = "";
    return;
  }

  if (
    containsWord(msg, "aléatoire") ||
    containsWord(msg, "random") ||
    containsWord(msg, "donne-moi") ||
    containsWord(msg, "un anime") ||
    containsWord(msg, "recommande-moi")
  ) {
    // Anime aléatoire - affiche jusqu'à 5 randoms
    const shuffled = animesData.sort(() => 0.5 - Math.random());
    const randomAnimes = shuffled.slice(0, 5);
    displayAnimes(randomAnimes, "Voici des animes aléatoires pour toi :");
    botMessage.textContent = "Pas besoin de filtre ? Voilà quelques pépites 👇";
    bot.style.display = "none";
    userInput.value = "";
    return;
  }

  if (
    containsWord(msg, "c'est quoi anim") ||
    containsWord(msg, "qui est anim") ||
    containsWord(msg, "qui êtes-vous") ||
    containsWord(msg, "staff") ||
    containsWord(msg, "équipe") ||
    containsWord(msg, "animplus") ||
    containsWord(msg, "anim+")
  ) {
    botMessage.textContent =
      "Anim+ est le fruit du travail passionné d’une petite équipe dédiée chez AnimPlusCorp. 💻✨\n\n" +
      "Notre mission : créer pour vous un site de streaming performant et intuitif, pensé pour devenir votre plateforme de rêve. Nous mettons tout en œuvre pour vous offrir une expérience fluide, avec des mises à jour régulières et des fonctionnalités innovantes.\n\n" +
      "Merci de faire partie de cette aventure avec nous ! ❤️\n\n" +
      "⚠️ Anim+ n'héberge aucun fichier, mais propose des liens vers des services tiers. Les questions juridiques doivent être traitées avec les hébergeurs et les fournisseurs de fichiers. Anim+ n'est pas responsable des fichiers multimédias diffusés par les fournisseurs de vidéos.";
    userInput.value = "";
    return;
  }

  // Détection genre, thème, langue
  if (containsWord(msg, "shonen")) detectedGenre = "shonen";
  else if (containsWord(msg, "seinen")) detectedGenre = "seinen";
  else if (containsWord(msg, "shojo")) detectedGenre = "shojo";
  else if (containsWord(msg, "josei")) detectedGenre = "josei";

  if (containsWord(msg, "action")) detectedTheme = "action";
  else if (containsWord(msg, "comedy") || containsWord(msg, "comédie")) detectedTheme = "comedy";
  else if (containsWord(msg, "fantasy")) detectedTheme = "fantasy";
  else if (containsWord(msg, "romance")) detectedTheme = "romance";
  else if (containsWord(msg, "drame") || containsWord(msg, "drama")) detectedTheme = "drama";

  if (containsWord(msg, "vf")) detectedLanguage = "vf";
  else if (containsWord(msg, "vo")) detectedLanguage = "vo";

  if (!detectedGenre && !detectedTheme && !detectedLanguage) {
    botMessage.textContent = "Hmm je n’ai pas compris… essaie un mot comme 'action', 'VF', 'romance' ou même 'anime aléatoire'.";
    userInput.value = "";
    return;
  }

  // Filtrage avec critères détectés
  const filtered = animesData.filter(anime => {
    const genreMatch = !detectedGenre || anime.genre.toLowerCase() === detectedGenre;
    const themeMatch = !detectedTheme || anime.theme.map(t => t.toLowerCase()).includes(detectedTheme);
    const languageMatch = !detectedLanguage || anime.language.toLowerCase() === detectedLanguage;
    return genreMatch && themeMatch && languageMatch;
  });

  if (filtered.length === 0) {
    botMessage.textContent = "Aucun anime ne correspond exactement à ta demande… Essaie d'être plus vague ou dis juste 'anime aléatoire' 😉";
    userInput.value = "";
    return;
  }

  displayAnimes(filtered, "Anim+ te recommande :");
  botMessage.textContent = "Tiens, je pense que ceux-ci pourraient te plaire ! 😄";
  bot.style.display = "none";
  userInput.value = "";
});
