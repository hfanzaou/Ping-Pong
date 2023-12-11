/*
  Warnings:

  - You are about to drop the column `upAvater` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "upAvater",
ADD COLUMN     "upAvatar" BOOLEAN NOT NULL DEFAULT false;
