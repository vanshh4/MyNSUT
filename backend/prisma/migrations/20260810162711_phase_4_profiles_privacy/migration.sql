-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'PLATFORM_ONLY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "AcademicSemester" AS ENUM ('SEM_1', 'SEM_2', 'SEM_3', 'SEM_4', 'SEM_5', 'SEM_6', 'SEM_7', 'SEM_8');

-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('O', 'A_PLUS', 'A', 'B_PLUS', 'B', 'C', 'P', 'F');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('PASS', 'FAIL', 'WITHHELD');

-- CreateEnum
CREATE TYPE "RankType" AS ENUM ('CLASS', 'UNIVERSITY');

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "bio" TEXT,
    "github_url" VARCHAR(255),
    "linkedin_url" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_privacy_settings" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "bio_visibility" "ProfileVisibility" NOT NULL DEFAULT 'PLATFORM_ONLY',
    "social_links_visibility" "ProfileVisibility" NOT NULL DEFAULT 'PLATFORM_ONLY',
    "academic_summary_visibility" "ProfileVisibility" NOT NULL DEFAULT 'PLATFORM_ONLY',
    "semester_results_visibility" "ProfileVisibility" NOT NULL DEFAULT 'PLATFORM_ONLY',
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "student_privacy_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_academic_summaries" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "current_cgpa" DOUBLE PRECISION,
    "total_credits_earned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "student_academic_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semester_results" (
    "id" UUID NOT NULL,
    "student_academic_summary_id" UUID NOT NULL,
    "semester" "AcademicSemester" NOT NULL,
    "sgpa" DOUBLE PRECISION,
    "cgpa" DOUBLE PRECISION,
    "credits_earned" DOUBLE PRECISION NOT NULL,
    "total_credits" DOUBLE PRECISION NOT NULL,
    "status" "ResultStatus" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "semester_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "credits" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_grades" (
    "id" UUID NOT NULL,
    "semester_result_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "grade" "Grade" NOT NULL,

    CONSTRAINT "subject_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_ranks" (
    "id" UUID NOT NULL,
    "student_academic_summary_id" UUID NOT NULL,
    "rank_type" "RankType" NOT NULL,
    "rank" INTEGER NOT NULL,
    "batch_size" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "student_ranks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_student_id_key" ON "student_profiles"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_privacy_settings_student_id_key" ON "student_privacy_settings"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_academic_summaries_student_id_key" ON "student_academic_summaries"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "semester_results_student_academic_summary_id_semester_key" ON "semester_results"("student_academic_summary_id", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subject_grades_semester_result_id_subject_id_key" ON "subject_grades"("semester_result_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_ranks_student_academic_summary_id_rank_type_key" ON "student_ranks"("student_academic_summary_id", "rank_type");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_privacy_settings" ADD CONSTRAINT "student_privacy_settings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_academic_summaries" ADD CONSTRAINT "student_academic_summaries_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_results" ADD CONSTRAINT "semester_results_student_academic_summary_id_fkey" FOREIGN KEY ("student_academic_summary_id") REFERENCES "student_academic_summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_grades" ADD CONSTRAINT "subject_grades_semester_result_id_fkey" FOREIGN KEY ("semester_result_id") REFERENCES "semester_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_grades" ADD CONSTRAINT "subject_grades_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_ranks" ADD CONSTRAINT "student_ranks_student_academic_summary_id_fkey" FOREIGN KEY ("student_academic_summary_id") REFERENCES "student_academic_summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
