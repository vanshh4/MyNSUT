-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('PYQ', 'NOTE', 'BOOK', 'REFERENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED');

-- CreateTable
CREATE TABLE "resources" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "resource_type" "ResourceType" NOT NULL,
    "subject_code" VARCHAR(20) NOT NULL,
    "subject_name" VARCHAR(120) NOT NULL,
    "department" VARCHAR(50),
    "semester" INTEGER,
    "academic_year" INTEGER,
    "exam_session" VARCHAR(50),
    "file_url" TEXT NOT NULL,
    "source" VARCHAR(255),
    "status" "ResourceStatus" NOT NULL DEFAULT 'DRAFT',
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resources_subject_code_idx" ON "resources"("subject_code");

-- CreateIndex
CREATE INDEX "resources_resource_type_idx" ON "resources"("resource_type");

-- CreateIndex
CREATE INDEX "resources_status_idx" ON "resources"("status");

-- CreateIndex
CREATE INDEX "resources_semester_idx" ON "resources"("semester");

-- CreateIndex
CREATE INDEX "resources_academic_year_idx" ON "resources"("academic_year");

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
