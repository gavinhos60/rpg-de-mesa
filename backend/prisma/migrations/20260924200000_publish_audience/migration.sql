-- AlterTable
ALTER TABLE "Papyrus" ADD COLUMN "audienceUserIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "PlayerNote" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PlayerNote" ADD COLUMN "audienceUserIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateIndex
CREATE INDEX "PlayerNote_campaignId_published_idx" ON "PlayerNote"("campaignId", "published");
