/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('TWO_D', 'THREE_D', 'SCRIPT');

-- CreateEnum
CREATE TYPE "AssetName" AS ENUM ('TRIANGLE', 'SQUARE', 'CIRCLE', 'CROSS');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "nickname" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "video" TEXT,
    "description" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "durationSec" INTEGER,
    "nbUav" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT[],

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Combination" (
    "id" TEXT NOT NULL,
    "assetOne" "AssetName" NOT NULL,
    "assetTwo" "AssetName",
    "assetThree" "AssetName",
    "assetFour" "AssetName",
    "foundAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foundById" TEXT NOT NULL,

    CONSTRAINT "Combination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Combination_assetOne_assetTwo_assetThree_assetFour_foundByI_key" ON "Combination"("assetOne", "assetTwo", "assetThree", "assetFour", "foundById");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- AddForeignKey
ALTER TABLE "Combination" ADD CONSTRAINT "Combination_foundById_fkey" FOREIGN KEY ("foundById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
