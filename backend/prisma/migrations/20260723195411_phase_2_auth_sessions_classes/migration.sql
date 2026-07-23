/*
  Warnings:

  - Added the required column `class_id` to the `students` table without a default value. This is not possible if the table is not empty.
  - Made the column `section` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `graduation_year` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AcademicClassStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "class_id" UUID NOT NULL,
ALTER COLUMN "section" SET NOT NULL,
ALTER COLUMN "graduation_year" SET NOT NULL;

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" CHAR(64) NOT NULL,
    "ip_address" VARCHAR(64),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_classes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "admission_year" INTEGER NOT NULL,
    "branch_code" VARCHAR(20) NOT NULL,
    "section" VARCHAR(20) NOT NULL,
    "status" "AcademicClassStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "academic_classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");

-- CreateIndex
CREATE INDEX "sessions_user_id_revoked_at_expires_at_idx" ON "sessions"("user_id", "revoked_at", "expires_at");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "academic_classes_status_idx" ON "academic_classes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "academic_classes_admission_year_branch_code_section_key" ON "academic_classes"("admission_year", "branch_code", "section");

-- CreateIndex
CREATE INDEX "students_class_id_idx" ON "students"("class_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "academic_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
