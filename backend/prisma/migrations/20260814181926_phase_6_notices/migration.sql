-- CreateEnum
CREATE TYPE "NoticeCategory" AS ENUM ('ACADEMIC', 'EXAMINATION', 'ADMINISTRATIVE', 'FEES', 'EVENTS', 'GENERAL');

-- CreateEnum
CREATE TYPE "NoticeStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "notices" (
    "id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" "NoticeCategory" NOT NULL,
    "source_authority" VARCHAR(255) NOT NULL,
    "official_url" TEXT NOT NULL,
    "published_at" TIMESTAMPTZ(6) NOT NULL,
    "expires_at" TIMESTAMPTZ(6),
    "status" "NoticeStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notices_status_idx" ON "notices"("status");

-- CreateIndex
CREATE INDEX "notices_category_idx" ON "notices"("category");

-- CreateIndex
CREATE INDEX "notices_published_at_idx" ON "notices"("published_at");

-- CreateIndex
CREATE INDEX "notices_expires_at_idx" ON "notices"("expires_at");

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
