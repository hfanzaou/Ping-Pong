/*
  Warnings:

  - The primary key for the `Notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_pkey",
ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("userId", "senderId");
