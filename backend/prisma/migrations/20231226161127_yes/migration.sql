/*
  Warnings:

  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MatchHistoryToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_userId_fkey";

-- DropForeignKey
ALTER TABLE "_MatchHistoryToUser" DROP CONSTRAINT "_MatchHistoryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MatchHistoryToUser" DROP CONSTRAINT "_MatchHistoryToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "achievement" JSONB,
ADD COLUMN     "matchHistoryId" INTEGER;

-- DropTable
DROP TABLE "Achievement";

-- DropTable
DROP TABLE "_MatchHistoryToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_matchHistoryId_fkey" FOREIGN KEY ("matchHistoryId") REFERENCES "MatchHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
