/*
  Warnings:

  - Added the required column `avatar` to the `MESSAGE` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MESSAGE" ADD COLUMN     "avatar" TEXT NOT NULL;
