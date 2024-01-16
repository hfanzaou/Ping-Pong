/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CHATHISTORY` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CHATHISTORY_name_key" ON "CHATHISTORY"("name");
