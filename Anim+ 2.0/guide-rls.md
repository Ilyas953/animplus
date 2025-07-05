# Guide pour résoudre les problèmes RLS (Row Level Security)

## 🚨 Problème actuel
Les erreurs "Colonne user_id non trouvée" et les violations RLS empêchent le fonctionnement des favoris et watchlist.

## 🔧 Solutions

### Option 1: Désactiver RLS temporairement (RECOMMANDÉ pour les tests)

1. **Ouvrez votre dashboard Supabase**
2. **Allez dans l'éditeur SQL**
3. **Exécutez ces commandes :**

```sql
-- Désactiver RLS sur les tables
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist DISABLE ROW LEVEL SECURITY;
```

4. **Vérifiez que RLS est désactivé :**
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('favorites', 'watchlist');
```

### Option 2: Configurer des politiques RLS sécurisées

Si vous voulez garder RLS activé, utilisez ces politiques :

```sql
-- Politiques pour la table favorites
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
    FOR DELETE USING (auth.uid()::text = user_id);

-- Politiques pour la table watchlist
CREATE POLICY "Users can view their own watchlist" ON watchlist
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own watchlist" ON watchlist
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own watchlist" ON watchlist
    FOR DELETE USING (auth.uid()::text = user_id);
```

## 🔍 Vérification de la structure des tables

Exécutez ces requêtes pour voir la structure exacte de vos tables :

```sql
-- Structure de la table favorites
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'favorites' 
ORDER BY ordinal_position;

-- Structure de la table watchlist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'watchlist' 
ORDER BY ordinal_position;
```

## 📋 Étapes à suivre

### Étape 1: Désactiver RLS
1. Ouvrez Supabase Dashboard
2. Allez dans SQL Editor
3. Exécutez : `ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;`
4. Exécutez : `ALTER TABLE watchlist DISABLE ROW LEVEL SECURITY;`

### Étape 2: Vérifier la structure
1. Exécutez les requêtes de vérification ci-dessus
2. Notez les noms exacts des colonnes
3. Vérifiez s'il y a des colonnes `created_at` ou `added_at`

### Étape 3: Tester
1. Ouvrez `test-tables.html` dans votre navigateur
2. Cliquez sur les boutons de test
3. Vérifiez que les erreurs RLS ont disparu

### Étape 4: Adapter le code si nécessaire
Si les noms de colonnes sont différents, nous adapterons le code en conséquence.

## 🆘 Si vous avez encore des erreurs

1. **Copiez les messages d'erreur exacts**
2. **Exécutez les requêtes de vérification de structure**
3. **Dites-moi quels sont les noms de colonnes affichés**

## 🔒 Sécurité

- **Pour la production** : Utilisez les politiques RLS sécurisées
- **Pour le développement** : Désactiver RLS est acceptable
- **N'oubliez pas** : Réactiver RLS avant la mise en production

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Copiez les messages d'erreur
2. Dites-moi quelle option vous avez choisie
3. Partagez les résultats des requêtes de vérification 