/*
  Warnings:

  - Made the column `name` on table `CHATHISTORY` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CHATHISTORY" ALTER COLUMN "name" SET NOT NULL;
