-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "playerScore" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchHistory_id_key" ON "MatchHistory"("id");

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
