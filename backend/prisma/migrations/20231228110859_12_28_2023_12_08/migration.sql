/*
  Warnings:

  - You are about to drop the `_HISTORYToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_HISTORYToUser" DROP CONSTRAINT "_HISTORYToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_HISTORYToUser" DROP CONSTRAINT "_HISTORYToUser_B_fkey";

-- DropTable
DROP TABLE "_HISTORYToUser";

-- CreateTable
CREATE TABLE "USERHISTORY" (
    "userId" INTEGER NOT NULL,
    "histotyId" INTEGER NOT NULL,

    CONSTRAINT "USERHISTORY_pkey" PRIMARY KEY ("userId","histotyId")
);

-- AddForeignKey
ALTER TABLE "USERHISTORY" ADD CONSTRAINT "USERHISTORY_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USERHISTORY" ADD CONSTRAINT "USERHISTORY_histotyId_fkey" FOREIGN KEY ("histotyId") REFERENCES "HISTORY"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
