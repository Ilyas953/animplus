// Système de Points A+ pour Anim+
class PointsSystem {
  constructor() {
    this.adDuration = 5; // Durée de la pub en secondes
    this.pointsPerAd = 2; // Points gagnés par pub
    this.dailyLimit = 20; // Limite quotidienne
    this.adInterval = null;
    this.adProgress = 0;
    this.userPoints = null;
    this.init();
  }

  async init() {
    await this.loadUserPoints();
    this.setupEventListeners();
    this.updateDisplay();
  }

  setupEventListeners() {
    const watchAdBtn = document.getElementById('watch-ad-btn');
    const skipAdBtn = document.getElementById('skip-ad-btn');

    if (watchAdBtn) {
      watchAdBtn.addEventListener('click', () => this.startAd());
    }

    if (skipAdBtn) {
      skipAdBtn.addEventListener('click', () => this.skipAd());
    }
  }

  async loadUserPoints() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return;
      }

      // Vérifier si l'utilisateur a déjà des points
      const { data: userPoints, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        return;
      }

      // Si l'utilisateur n'a pas encore de points, les créer
      if (!userPoints) {
        await this.createUserPoints(userId);
        this.userPoints = {
          points_earned_today: 0,
          total_points: 0,
          last_reset_date: new Date().toISOString().split('T')[0]
        };
      } else {
        this.userPoints = userPoints;
      }

      // Vérifier si on doit réinitialiser les points quotidiens
      await this.checkDailyReset(userId, this.userPoints);
    } catch (error) {
      // Initialiser avec des valeurs par défaut en cas d'erreur
      this.userPoints = {
        points_earned_today: 0,
        total_points: 0,
        last_reset_date: new Date().toISOString().split('T')[0]
      };
    }
  }

  async createUserPoints(userId) {
    try {
      const { error } = await supabase
        .from('user_points')
        .insert([
          {
            user_id: userId,
            points_earned_today: 0,
            total_points: 0,
            last_reset_date: new Date().toISOString().split('T')[0]
          }
        ]);
    } catch (error) {
      // Erreur silencieuse
    }
  }

  async checkDailyReset(userId, userPoints) {
    const today = new Date().toISOString().split('T')[0];
    const lastReset = userPoints.last_reset_date;

    if (lastReset !== today) {
      // Réinitialiser les points quotidiens
      const { error } = await supabase
        .from('user_points')
        .update({
          points_earned_today: 0,
          last_reset_date: today
        })
        .eq('user_id', userId);
      
      if (!error) {
        userPoints.points_earned_today = 0;
        userPoints.last_reset_date = today;
      }
    }
  }

  async startAd() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.showStatus('Vous devez être connecté pour gagner des points', 'error');
      return;
    }

    // Vérifier que les points sont chargés
    if (!this.userPoints) {
      await this.loadUserPoints();
      if (!this.userPoints) {
        this.showStatus('Erreur lors du chargement des points', 'error');
        return;
      }
    }

    // Vérifier la limite quotidienne
    if (this.userPoints.points_earned_today >= this.dailyLimit) {
      this.showStatus('Vous avez atteint la limite quotidienne de 20 points', 'error');
      return;
    }

    // Désactiver le bouton
    const watchAdBtn = document.getElementById('watch-ad-btn');
    watchAdBtn.disabled = true;
    watchAdBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Chargement...';

    // Afficher la zone de pub
    const adContainer = document.getElementById('ad-container');
    adContainer.classList.remove('hidden');

    // Démarrer le compte à rebours
    this.startCountdown();
  }

  startCountdown() {
    let timeLeft = this.adDuration;
    this.adProgress = 0;
    
    const countdownElement = document.getElementById('ad-countdown');
    const progressElement = document.getElementById('ad-progress');
    
    this.adInterval = setInterval(() => {
      timeLeft--;
      this.adProgress = ((this.adDuration - timeLeft) / this.adDuration) * 100;
      
      if (countdownElement) countdownElement.textContent = timeLeft;
      if (progressElement) progressElement.style.width = this.adProgress + '%';
      
      if (timeLeft <= 0) {
        this.completeAd();
      }
    }, 1000);
  }

  skipAd() {
    if (this.adInterval) {
      clearInterval(this.adInterval);
    }
    this.hideAd();
    this.showStatus('Publicité passée - Aucun point gagné', 'warning');
  }

  async completeAd() {
    if (this.adInterval) {
      clearInterval(this.adInterval);
    }

    // Ajouter les points
    await this.addPoints(this.pointsPerAd);
    
    this.hideAd();
    this.showStatus(`+${this.pointsPerAd} points gagnés !`, 'success');
    
    // Réactiver le bouton après un délai
    setTimeout(() => {
      const watchAdBtn = document.getElementById('watch-ad-btn');
      if (watchAdBtn) {
        watchAdBtn.disabled = false;
        watchAdBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Regarder une Publicité (+2 points)';
      }
    }, 2000);
  }

  hideAd() {
    const adContainer = document.getElementById('ad-container');
    adContainer.classList.add('hidden');
    
    // Réinitialiser la barre de progression
    const progressElement = document.getElementById('ad-progress');
    if (progressElement) progressElement.style.width = '0%';
  }

  async addPoints(points) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // Vérifier que les points sont chargés
      if (!this.userPoints) {
        await this.loadUserPoints();
        if (!this.userPoints) return;
      }

      const newTodayPoints = this.userPoints.points_earned_today + points;
      const newTotalPoints = this.userPoints.total_points + points;

      const { error } = await supabase
        .from('user_points')
        .update({
          points_earned_today: newTodayPoints,
          total_points: newTotalPoints
        })
        .eq('user_id', userId);

      if (error) {
        return;
      }

      // Mettre à jour les données locales
      this.userPoints.points_earned_today = newTodayPoints;
      this.userPoints.total_points = newTotalPoints;

      this.updateDisplay();
    } catch (error) {
      // Erreur silencieuse
    }
  }

  updateDisplay() {
    if (!this.userPoints) return;

    // Points totaux
    const totalPointsElement = document.getElementById('total-points');
    if (totalPointsElement) {
      totalPointsElement.textContent = this.userPoints.total_points;
    }

    // Points d'aujourd'hui
    const todayPointsElement = document.getElementById('today-points');
    if (todayPointsElement) {
      todayPointsElement.textContent = this.userPoints.points_earned_today;
    }

    // Barre de progression
    const progressBarElement = document.getElementById('progress-bar');
    if (progressBarElement) {
      const progress = (this.userPoints.points_earned_today / this.dailyLimit) * 100;
      progressBarElement.style.width = Math.min(progress, 100) + '%';
    }

    // Prochain reset
    const nextResetElement = document.getElementById('next-reset');
    if (nextResetElement) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      nextResetElement.textContent = tomorrow.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long' 
      });
    }

    // Désactiver le bouton si limite atteinte
    const watchAdBtn = document.getElementById('watch-ad-btn');
    if (watchAdBtn) {
      if (this.userPoints.points_earned_today >= this.dailyLimit) {
        watchAdBtn.disabled = true;
        watchAdBtn.innerHTML = '<i class="fas fa-lock mr-2"></i>Limite quotidienne atteinte';
      } else {
        watchAdBtn.disabled = false;
        watchAdBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Regarder une Publicité (+2 points)';
      }
    }
  }

  showStatus(message, type = 'info') {
    const statusElement = document.getElementById('ad-status');
    if (!statusElement) return;

    const colors = {
      success: 'text-green-400',
      error: 'text-red-400',
      warning: 'text-yellow-400',
      info: 'text-blue-400'
    };

    statusElement.className = `text-center text-sm ${colors[type] || colors.info}`;
    statusElement.textContent = message;

    // Effacer le message après 5 secondes
    setTimeout(() => {
      statusElement.textContent = '';
    }, 5000);
  }
}

// Initialiser le système de points quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si on est sur la page de profil
  if (document.getElementById('subscription-tab')) {
    window.pointsSystem = new PointsSystem();
  }
});

// Exporter pour utilisation globale
window.PointsSystem = PointsSystem; 