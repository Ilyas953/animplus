// Adaptateur pour les tables favorites et watchlist
class TableAdapter {
    constructor() {
        this.columnMappings = {
            userId: ['user_id', 'userid', 'userId', 'user'],
            timestamp: ['created_at', 'added_at', 'timestamp', 'date']
        };
        this.detectedColumns = {};
    }

    async detectTableStructure(tableName) {
        try {
            // Essayer de récupérer une ligne pour voir la structure
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);
            
            if (error) {
                return false;
            }

            if (data && data.length > 0) {
                const columns = Object.keys(data[0]);
                this.detectedColumns[tableName] = columns;
                return true;
            } else {
                // Table vide, essayer avec une requête de métadonnées
                this.detectedColumns[tableName] = ['id', 'user_id', 'anime_id', 'anime_title', 'anime_image', 'added_at'];
                return true;
            }
        } catch (error) {
            return false;
        }
    }

    getUserIdColumn(tableName) {
        const columns = this.detectedColumns[tableName] || [];
        
        // Chercher une colonne qui correspond à un identifiant utilisateur
        for (const pattern of this.columnMappings.userId) {
            if (columns.includes(pattern)) {
                return pattern;
            }
        }

        // Si aucune colonne trouvée, essayer de deviner
        const possibleColumns = columns.filter(col => 
            col.toLowerCase().includes('user') || 
            col.toLowerCase().includes('id')
        );

        if (possibleColumns.length > 0) {
            return possibleColumns[0];
        }

        // Fallback
        return 'user_id';
    }

    getTimestampColumn(tableName) {
        const columns = this.detectedColumns[tableName] || [];
        
        for (const pattern of this.columnMappings.timestamp) {
            if (columns.includes(pattern)) {
                return pattern;
            }
        }

        return 'added_at';
    }

    async getFavorites(userId) {
        try {
            const tableName = 'favorites';
            await this.detectTableStructure(tableName);
            
            const userIdColumn = this.getUserIdColumn(tableName);

            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq(userIdColumn, userId)
                .order(this.getTimestampColumn(tableName), { ascending: false });

            if (error) {
                throw new Error(`Erreur lors du chargement des favoris: ${error.message}`);
            }

            return data || [];
        } catch (error) {
            throw error;
        }
    }

    async getWatchlist(userId) {
        try {
            const tableName = 'watchlist';
            await this.detectTableStructure(tableName);
            
            const userIdColumn = this.getUserIdColumn(tableName);

            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq(userIdColumn, userId)
                .order(this.getTimestampColumn(tableName), { ascending: false });

            if (error) {
                throw new Error(`Erreur lors du chargement de la liste: ${error.message}`);
            }

            return data || [];
        } catch (error) {
            throw error;
        }
    }

    async addToFavorites(userId, animeData) {
        try {
            const tableName = 'favorites';
            await this.detectTableStructure(tableName);
            
            const userIdColumn = this.getUserIdColumn(tableName);
            const timestampColumn = this.getTimestampColumn(tableName);

            const insertData = {
                [userIdColumn]: userId,
                anime_id: animeData.anime_id || animeData.id,
                anime_title: animeData.title,
                anime_image: animeData.image
            };

            // Ajouter le timestamp si la colonne existe
            if (this.detectedColumns[tableName].includes(timestampColumn)) {
                insertData[timestampColumn] = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from(tableName)
                .insert([insertData])
                .select();

            if (error) {
                throw new Error(`Erreur lors de l'ajout aux favoris: ${error.message}`);
            }

            return data ? (Array.isArray(data) ? data[0] : data) : null;
        } catch (error) {
            throw error;
        }
    }

    async addToWatchlist(userId, animeData) {
        try {
            const tableName = 'watchlist';
            await this.detectTableStructure(tableName);
            
            const userIdColumn = this.getUserIdColumn(tableName);
            const timestampColumn = this.getTimestampColumn(tableName);

            const insertData = {
                [userIdColumn]: userId,
                anime_id: animeData.anime_id || animeData.id,
                anime_title: animeData.title,
                anime_image: animeData.image
            };

            // Ajouter le timestamp si la colonne existe
            if (this.detectedColumns[tableName].includes(timestampColumn)) {
                insertData[timestampColumn] = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from(tableName)
                .insert([insertData])
                .select();

            if (error) {
                throw new Error(`Erreur lors de l'ajout à la watchlist: ${error.message}`);
            }

            return data ? (Array.isArray(data) ? data[0] : data) : null;
        } catch (error) {
            throw error;
        }
    }

    async removeFromFavorites(userId, animeId) {
        try {
            const tableName = 'favorites';
            await this.detectTableStructure(tableName);
            
            const userIdColumn = this.getUserIdColumn(tableName);

            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq(userIdColumn, userId)
                .eq('anime_id', animeId);

            if (error) {
                throw new Error(`Erreur lors de la suppression des favoris: ${error.message}`);
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    async removeFromWatchlist(userId, animeId) {
        try {
            const tableName = 'watchlist';
            await this.detectTableStructure(tableName);
            
            const userIdColumn = this.getUserIdColumn(tableName);

            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq(userIdColumn, userId)
                .eq('anime_id', animeId);

            if (error) {
                throw new Error(`Erreur lors de la suppression de la watchlist: ${error.message}`);
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    async isInFavorites(userId, animeId) {
        try {
            const tableName = 'favorites';
            await this.detectTableStructure(tableName);
            
            const userIdColumn = this.getUserIdColumn(tableName);

            const { data, error } = await supabase
                .from(tableName)
                .select('id')
                .eq(userIdColumn, userId)
                .eq('anime_id', animeId)
                .limit(1);

            if (error) {
                throw new Error(`Erreur lors de la vérification des favoris: ${error.message}`);
            }

            return data && data.length > 0;
        } catch (error) {
            throw error;
        }
    }

    async isInWatchlist(userId, animeId) {
        try {
            const tableName = 'watchlist';
            await this.detectTableStructure(tableName);
            
            const userIdColumn = this.getUserIdColumn(tableName);

            const { data, error } = await supabase
                .from(tableName)
                .select('id')
                .eq(userIdColumn, userId)
                .eq('anime_id', animeId)
                .limit(1);

            if (error) {
                throw new Error(`Erreur lors de la vérification de la watchlist: ${error.message}`);
            }

            return data && data.length > 0;
        } catch (error) {
            throw error;
        }
    }
}

// Initialiser l'adaptateur quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    window.tableAdapter = new TableAdapter();
});

// Exporter pour utilisation globale
window.TableAdapter = TableAdapter; 