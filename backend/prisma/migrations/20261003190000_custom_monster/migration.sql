-- CreateTable
CREATE TABLE "CustomMonster" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "sheet" JSONB,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomMonster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomMonster_userId_idx" ON "CustomMonster"("userId");

-- AddForeignKey
ALTER TABLE "CustomMonster" ADD CONSTRAINT "CustomMonster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
