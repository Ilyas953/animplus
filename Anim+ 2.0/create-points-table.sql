-- Script pour créer la table user_points dans Supabase
-- Exécutez ce script dans votre éditeur SQL Supabase

-- Créer la table user_points
CREATE TABLE IF NOT EXISTS user_points (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  points_earned_today INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Désactiver RLS pour la table points (pour simplifier)
ALTER TABLE user_points DISABLE ROW LEVEL SECURITY;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_reset_date ON user_points(last_reset_date);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_user_points_updated_at 
    BEFORE UPDATE ON user_points 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour réinitialiser les points quotidiens
CREATE OR REPLACE FUNCTION reset_daily_points()
RETURNS void AS $$
BEGIN
    UPDATE user_points 
    SET points_earned_today = 0, 
        last_reset_date = CURRENT_DATE 
    WHERE last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Insérer des données de test (optionnel - décommentez si vous voulez tester)
-- INSERT INTO user_points (user_id, points_earned_today, total_points) 
-- VALUES ('test-user-id', 0, 0) 
-- ON CONFLICT (user_id) DO NOTHING; 