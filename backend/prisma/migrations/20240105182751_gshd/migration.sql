/*
  Warnings:

  - You are about to drop the column `createAt` on the `MESSAGE` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `MESSAGE` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MESSAGE" DROP COLUMN "createAt",
DROP COLUMN "updateAt";
