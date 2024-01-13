-- DropIndex
DROP INDEX "Notifications_userId_key";

-- AlterTable
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("userId", "senderId");
