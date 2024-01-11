/*
  Warnings:

  - Added the required column `hash` to the `GROUP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `GROUP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GROUP" ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
