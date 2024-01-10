-- CreateTable
CREATE TABLE "GROUP" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "admins" TEXT[],

    CONSTRAINT "GROUP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGROUP" (
    "userid" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "UserGROUP_pkey" PRIMARY KEY ("userid","groupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GROUP_id_key" ON "GROUP"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GROUP_name_key" ON "GROUP"("name");

-- AddForeignKey
ALTER TABLE "UserGROUP" ADD CONSTRAINT "UserGROUP_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGROUP" ADD CONSTRAINT "UserGROUP_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GROUP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
