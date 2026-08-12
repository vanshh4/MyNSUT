-- CreateEnum
CREATE TYPE "ClassTaskType" AS ENUM ('FILL_FORM', 'READ_DOCUMENT', 'SUBMIT_ASSIGNMENT', 'OTHER');

-- CreateTable
CREATE TABLE "class_announcements" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "class_announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_tasks" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "task_type" "ClassTaskType" NOT NULL,
    "url" TEXT,
    "due_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "class_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_task_completions" (
    "id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "completed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_task_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "class_announcements_class_id_idx" ON "class_announcements"("class_id");

-- CreateIndex
CREATE INDEX "class_announcements_created_at_idx" ON "class_announcements"("created_at");

-- CreateIndex
CREATE INDEX "class_tasks_class_id_idx" ON "class_tasks"("class_id");

-- CreateIndex
CREATE INDEX "class_tasks_due_date_idx" ON "class_tasks"("due_date");

-- CreateIndex
CREATE INDEX "class_task_completions_student_id_idx" ON "class_task_completions"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_task_completions_task_id_student_id_key" ON "class_task_completions"("task_id", "student_id");

-- AddForeignKey
ALTER TABLE "class_announcements" ADD CONSTRAINT "class_announcements_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "academic_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_announcements" ADD CONSTRAINT "class_announcements_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_tasks" ADD CONSTRAINT "class_tasks_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "academic_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_tasks" ADD CONSTRAINT "class_tasks_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_task_completions" ADD CONSTRAINT "class_task_completions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "class_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_task_completions" ADD CONSTRAINT "class_task_completions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
