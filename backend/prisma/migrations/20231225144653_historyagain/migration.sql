/*
  Warnings:

  - You are about to drop the column `ach1` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `ach2` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `ach3` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `ach4` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `ach5` on the `Achievement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "ach1",
DROP COLUMN "ach2",
DROP COLUMN "ach3",
DROP COLUMN "ach4",
DROP COLUMN "ach5",
ADD COLUMN     "achievement1" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "achievement2" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "achievement3" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "achievement4" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "achievement5" BOOLEAN NOT NULL DEFAULT false;
