/*
  # Création de la table car_models pour le suivi de génération de contenus automobile

  1. Nouvelle table
    - `car_models`
      - `id` (text, clé primaire) - ID unique du modèle
      - `label` (text) - Nom du modèle
      - `brand_label` (text) - Marque
      - `brand_id` (text) - ID de la marque
      - `status` (text) - Statut avec contrainte enum
      - `commentaire` (text) - Commentaire libre
      - `collaborateur` (text) - Collaborateur assigné avec contrainte enum
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de dernière modification

  2. Sécurité
    - Activer RLS sur la table `car_models`
    - Politique pour permettre toutes les opérations aux utilisateurs authentifiés

  3. Contraintes
    - Contrainte CHECK pour les valeurs de status
    - Contrainte CHECK pour les valeurs de collaborateur
    - Trigger pour mise à jour automatique de updated_at
*/

-- Créer la table car_models
CREATE TABLE IF NOT EXISTS car_models (
  id text PRIMARY KEY,
  label text NOT NULL,
  brand_label text NOT NULL,
  brand_id text NOT NULL,
  status text NOT NULL DEFAULT 'Pas encore',
  commentaire text DEFAULT '',
  collaborateur text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Contraintes pour les valeurs autorisées
  CONSTRAINT valid_status CHECK (status IN ('Pas encore', 'En cours', 'Terminé', 'Hors cible', 'À ne pas générer')),
  CONSTRAINT valid_collaborateur CHECK (collaborateur IS NULL OR collaborateur IN ('Ayoub KHYATI', 'Ayoub MARAHRAN', 'Zakaria ELFOUNDY', 'Nouhaila MESLAOUI', 'Sanaa ABRIL'))
);

-- Activer RLS
ALTER TABLE car_models ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations aux utilisateurs authentifiés
CREATE POLICY "Utilisateurs authentifiés peuvent tout faire"
  ON car_models
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_car_models_updated_at ON car_models;
CREATE TRIGGER update_car_models_updated_at
  BEFORE UPDATE ON car_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_car_models_brand_label ON car_models(brand_label);
CREATE INDEX IF NOT EXISTS idx_car_models_status ON car_models(status);
CREATE INDEX IF NOT EXISTS idx_car_models_collaborateur ON car_models(collaborateur);