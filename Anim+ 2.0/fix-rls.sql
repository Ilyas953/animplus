-- Script pour gérer les politiques RLS des tables favorites et watchlist
-- Exécutez ce script dans votre éditeur SQL Supabase

-- =====================================================
-- OPTION 1: DÉSACTIVER RLS TEMPORAIREMENT (RECOMMANDÉ POUR LES TESTS)
-- =====================================================

-- Désactiver RLS sur la table favorites
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur la table watchlist  
ALTER TABLE watchlist DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- OPTION 2: CONFIGURER DES POLITIQUES RLS SÉCURISÉES
-- =====================================================

-- Si vous préférez garder RLS activé, utilisez ces politiques à la place :

-- Réactiver RLS (décommentez si vous voulez utiliser les politiques)
-- ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres favoris
-- CREATE POLICY "Users can view their own favorites" ON favorites
--     FOR SELECT USING (auth.uid()::text = user_id);

-- Politique pour permettre aux utilisateurs d'ajouter leurs propres favoris
-- CREATE POLICY "Users can insert their own favorites" ON favorites
--     FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres favoris
-- CREATE POLICY "Users can delete their own favorites" ON favorites
--     FOR DELETE USING (auth.uid()::text = user_id);

-- Politique pour permettre aux utilisateurs de voir leur propre watchlist
-- CREATE POLICY "Users can view their own watchlist" ON watchlist
--     FOR SELECT USING (auth.uid()::text = user_id);

-- Politique pour permettre aux utilisateurs d'ajouter à leur propre watchlist
-- CREATE POLICY "Users can insert their own watchlist" ON watchlist
--     FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Politique pour permettre aux utilisateurs de supprimer de leur propre watchlist
-- CREATE POLICY "Users can delete their own watchlist" ON watchlist
--     FOR DELETE USING (auth.uid()::text = user_id);

-- =====================================================
-- VÉRIFICATION DE LA STRUCTURE DES TABLES
-- =====================================================

-- Vérifier la structure de la table favorites
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'favorites' 
ORDER BY ordinal_position;

-- Vérifier la structure de la table watchlist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'watchlist' 
ORDER BY ordinal_position;

-- =====================================================
-- AJOUT DE COLONNES MANQUANTES SI NÉCESSAIRE
-- =====================================================

-- Si la colonne created_at n'existe pas, l'ajouter
-- ALTER TABLE favorites ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- ALTER TABLE watchlist ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Si la colonne added_at n'existe pas, l'ajouter
-- ALTER TABLE favorites ADD COLUMN IF NOT EXISTS added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- ALTER TABLE watchlist ADD COLUMN IF NOT EXISTS added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =====================================================
-- TEST D'INSERTION
-- =====================================================

-- Test d'insertion dans favorites (remplacez 'test-user-id' par un vrai ID utilisateur)
-- INSERT INTO favorites (user_id, anime_id, anime_title, anime_image) 
-- VALUES ('test-user-id', 'test-anime-1', 'Test Anime', 'test-image.jpg')
-- ON CONFLICT (user_id, anime_id) DO NOTHING;

-- Test d'insertion dans watchlist (remplacez 'test-user-id' par un vrai ID utilisateur)
-- INSERT INTO watchlist (user_id, anime_id, anime_title, anime_image) 
-- VALUES ('test-user-id', 'test-anime-1', 'Test Anime', 'test-image.jpg')
-- ON CONFLICT (user_id, anime_id) DO NOTHING; 