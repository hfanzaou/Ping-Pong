/*
  Warnings:

  - You are about to drop the `_blocked` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_blocked" DROP CONSTRAINT "_blocked_A_fkey";

-- DropForeignKey
ALTER TABLE "_blocked" DROP CONSTRAINT "_blocked_B_fkey";

-- DropTable
DROP TABLE "_blocked";

-- CreateTable
CREATE TABLE "_Blocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Blocked_AB_unique" ON "_Blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_Blocked_B_index" ON "_Blocked"("B");

-- AddForeignKey
ALTER TABLE "_Blocked" ADD CONSTRAINT "_Blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Blocked" ADD CONSTRAINT "_Blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
