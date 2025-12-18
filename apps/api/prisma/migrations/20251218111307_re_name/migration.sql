/*
  1) Créer le type enum Postgres si pas déjà présent
*/
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AssetName') THEN
    CREATE TYPE "AssetName" AS ENUM ('TRIANGLE', 'SQUARE', 'CIRCLE', 'CROSS');
  END IF;
END$$;

/*
  2) Normaliser les données existantes (minuscule -> majuscule)
*/
UPDATE "Asset"
SET "name" = CASE
  WHEN "name" ILIKE 'triangle' THEN 'TRIANGLE'
  WHEN "name" ILIKE 'square'   THEN 'SQUARE'
  WHEN "name" ILIKE 'circle'   THEN 'CIRCLE'
  WHEN "name" ILIKE 'cross'    THEN 'CROSS'
  ELSE "name"
END;

/*
  3) Convertir le type avec cast explicite
*/
ALTER TABLE "Asset"
ALTER COLUMN "name" TYPE "AssetName"
USING "name"::"AssetName";

/*
  4) Conserver NOT NULL (si tu veux être explicite)
*/
ALTER TABLE "Asset"
ALTER COLUMN "name" SET NOT NULL;
