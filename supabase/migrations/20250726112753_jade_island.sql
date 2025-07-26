/*
  # Création de la table car_models pour le suivi de génération de contenus automobile

  1. Nouvelles Tables
    - `car_models`
      - `id` (text, clé primaire) - ID unique du modèle
      - `label` (text) - Nom du modèle
      - `brand_label` (text) - Marque
      - `brand_id` (text) - ID de la marque
      - `status` (text) - Statut d'avancement avec valeurs par défaut
      - `commentaire` (text) - Commentaires libres
      - `collaborateur` (text) - Collaborateur assigné
      - `created_at` (timestamp) - Date de création automatique
      - `updated_at` (timestamp) - Date de dernière modification

  2. Sécurité
    - Activation de RLS sur la table `car_models`
    - Politique permettant la lecture et modification pour tous les utilisateurs authentifiés

  3. Contraintes
    - Contrainte CHECK pour valider les valeurs de status
    - Contrainte CHECK pour valider les collaborateurs
*/

-- Création de la table car_models
CREATE TABLE IF NOT EXISTS car_models (
  id text PRIMARY KEY,
  label text NOT NULL,
  brand_label text NOT NULL,
  brand_id text NOT NULL,
  status text DEFAULT 'Pas encore' CHECK (status IN ('Pas encore', 'En cours', 'Terminé', 'Hors cible', 'À ne pas générer')),
  commentaire text DEFAULT '',
  collaborateur text CHECK (collaborateur IS NULL OR collaborateur IN ('Ayoub KHYATI', 'Ayoub MARAHRAN', 'Zakaria ELFOUNDY', 'Nouhaila MESLAOUI', 'Sanaa ABRIL')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activation de RLS
ALTER TABLE car_models ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage car models"
  ON car_models
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_car_models_updated_at
  BEFORE UPDATE ON car_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();