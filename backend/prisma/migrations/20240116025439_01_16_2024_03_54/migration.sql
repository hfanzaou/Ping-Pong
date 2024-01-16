/*
  Warnings:

  - Added the required column `name` to the `CHATHISTORY` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CHATHISTORY" ADD COLUMN     "name" TEXT NOT NULL;
