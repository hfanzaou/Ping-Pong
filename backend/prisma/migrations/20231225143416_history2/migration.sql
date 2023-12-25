/*
  Warnings:

  - You are about to drop the column `playser2Id` on the `MatchHistory` table. All the data in the column will be lost.
  - Added the required column `player2Id` to the `MatchHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchHistory" DROP COLUMN "playser2Id",
ADD COLUMN     "player2Id" INTEGER NOT NULL;
