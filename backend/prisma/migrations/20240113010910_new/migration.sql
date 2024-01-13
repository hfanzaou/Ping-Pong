/*
  Warnings:

  - You are about to drop the column `win` on the `MatchHistory` table. All the data in the column will be lost.
  - You are about to drop the column `matchHistoryId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_matchHistoryId_fkey";

-- AlterTable
ALTER TABLE "MatchHistory" DROP COLUMN "win",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "matchHistoryId";

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
