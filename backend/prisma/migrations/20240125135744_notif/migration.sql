/*
  Warnings:

  - The primary key for the `Notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_id_key" ON "Notifications"("id");
