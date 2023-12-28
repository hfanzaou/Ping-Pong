/*
  Warnings:

  - You are about to drop the column `Win` on the `MatchHistory` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `MatchHistory` table. All the data in the column will be lost.
  - Added the required column `playser2Id` to the `MatchHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MatchHistory" DROP CONSTRAINT "MatchHistory_playerId_fkey";

-- AlterTable
ALTER TABLE "MatchHistory" DROP COLUMN "Win",
DROP COLUMN "player2Id",
ADD COLUMN     "playser2Id" INTEGER NOT NULL,
ADD COLUMN     "win" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_MatchHistoryToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MatchHistoryToUser_AB_unique" ON "_MatchHistoryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MatchHistoryToUser_B_index" ON "_MatchHistoryToUser"("B");

-- AddForeignKey
ALTER TABLE "_MatchHistoryToUser" ADD CONSTRAINT "_MatchHistoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "MatchHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchHistoryToUser" ADD CONSTRAINT "_MatchHistoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
