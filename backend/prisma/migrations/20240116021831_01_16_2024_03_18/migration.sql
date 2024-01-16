/*
  Warnings:

  - You are about to drop the column `groupId` on the `CHATHISTORY` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CHATHISTORY" DROP CONSTRAINT "CHATHISTORY_groupId_fkey";

-- DropIndex
DROP INDEX "CHATHISTORY_groupId_key";

-- AlterTable
ALTER TABLE "CHATHISTORY" DROP COLUMN "groupId";
