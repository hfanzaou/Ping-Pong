/*
  Warnings:

  - You are about to drop the column `achievement` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "achievement";

-- CreateTable
CREATE TABLE "Achievement" (
    "userId" INTEGER NOT NULL,
    "ach1" BOOLEAN NOT NULL DEFAULT false,
    "ach2" BOOLEAN NOT NULL DEFAULT false,
    "ach3" BOOLEAN NOT NULL DEFAULT false,
    "ach4" BOOLEAN NOT NULL DEFAULT false,
    "ach5" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_userId_key" ON "Achievement"("userId");

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
