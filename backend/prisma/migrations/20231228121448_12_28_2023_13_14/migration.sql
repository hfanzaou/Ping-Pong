/*
  Warnings:

  - You are about to drop the `HISTORY` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `USERHISTORY` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "USERHISTORY" DROP CONSTRAINT "USERHISTORY_histotyId_fkey";

-- DropForeignKey
ALTER TABLE "USERHISTORY" DROP CONSTRAINT "USERHISTORY_userId_fkey";

-- DropTable
DROP TABLE "HISTORY";

-- DropTable
DROP TABLE "USERHISTORY";
