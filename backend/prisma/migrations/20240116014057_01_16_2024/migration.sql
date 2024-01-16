/*
  Warnings:

  - A unique constraint covering the columns `[groupId]` on the table `CHATHISTORY` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `CHATHISTORY` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CHATHISTORY" ADD COLUMN     "groupId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CHATHISTORY_groupId_key" ON "CHATHISTORY"("groupId");

-- AddForeignKey
ALTER TABLE "CHATHISTORY" ADD CONSTRAINT "CHATHISTORY_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GROUP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
