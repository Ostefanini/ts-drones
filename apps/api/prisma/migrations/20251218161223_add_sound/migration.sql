/*
  Warnings:

  - A unique constraint covering the columns `[assetOne,assetTwo,assetThree,assetFour,sound,foundById]` on the table `Combination` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Sound" AS ENUM ('NONE', 'EMERVEILLE', 'HEALING', 'GLOSSY');

-- DropIndex
DROP INDEX "Combination_assetOne_assetTwo_assetThree_assetFour_foundByI_key";

-- AlterTable
ALTER TABLE "Combination" ADD COLUMN     "sound" "Sound" NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX "Combination_assetOne_assetTwo_assetThree_assetFour_sound_fo_key" ON "Combination"("assetOne", "assetTwo", "assetThree", "assetFour", "sound", "foundById");
