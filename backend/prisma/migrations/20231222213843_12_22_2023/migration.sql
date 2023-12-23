/*
  Warnings:

  - You are about to drop the `ChatUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ChatUser";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "upAvatar" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT,
    "state" TEXT NOT NULL DEFAULT 'Offline',
    "twoFaAuth" BOOLEAN NOT NULL,
    "twoFaSecret" JSONB,
    "achievement" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Friends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Blocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_Friends_AB_unique" ON "_Friends"("A", "B");

-- CreateIndex
CREATE INDEX "_Friends_B_index" ON "_Friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Blocked_AB_unique" ON "_Blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_Blocked_B_index" ON "_Blocked"("B");

-- AddForeignKey
ALTER TABLE "_Friends" ADD CONSTRAINT "_Friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friends" ADD CONSTRAINT "_Friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Blocked" ADD CONSTRAINT "_Blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Blocked" ADD CONSTRAINT "_Blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
