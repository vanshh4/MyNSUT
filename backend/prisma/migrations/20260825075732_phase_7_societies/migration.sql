-- CreateEnum
CREATE TYPE "SocietyCategory" AS ENUM ('TECH', 'CULTURAL', 'LITERARY', 'SPORTS', 'MANAGEMENT', 'SOCIAL', 'ACADEMIC', 'OTHER');

-- CreateTable
CREATE TABLE "societies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "category" "SocietyCategory" NOT NULL,
    "logo_url" TEXT,
    "cover_image_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "societies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_memberships" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "society_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "society_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_positions" (
    "id" UUID NOT NULL,
    "society_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "parent_position_id" UUID,
    "can_assign_por" BOOLEAN NOT NULL DEFAULT false,
    "can_manage_members" BOOLEAN NOT NULL DEFAULT false,
    "can_post_announcements" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "society_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_position_assignments" (
    "id" UUID NOT NULL,
    "membership_id" UUID NOT NULL,
    "position_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "society_position_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_announcements" (
    "id" UUID NOT NULL,
    "society_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "attachment_url" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "society_announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "society_memberships_society_id_idx" ON "society_memberships"("society_id");

-- CreateIndex
CREATE UNIQUE INDEX "society_memberships_user_id_society_id_key" ON "society_memberships"("user_id", "society_id");

-- CreateIndex
CREATE INDEX "society_positions_society_id_idx" ON "society_positions"("society_id");

-- CreateIndex
CREATE INDEX "society_position_assignments_position_id_idx" ON "society_position_assignments"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "society_position_assignments_membership_id_position_id_key" ON "society_position_assignments"("membership_id", "position_id");

-- CreateIndex
CREATE INDEX "society_announcements_society_id_idx" ON "society_announcements"("society_id");

-- CreateIndex
CREATE INDEX "society_announcements_created_at_idx" ON "society_announcements"("created_at");

-- AddForeignKey
ALTER TABLE "society_roles" ADD CONSTRAINT "society_roles_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_memberships" ADD CONSTRAINT "society_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_memberships" ADD CONSTRAINT "society_memberships_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_positions" ADD CONSTRAINT "society_positions_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_positions" ADD CONSTRAINT "society_positions_parent_position_id_fkey" FOREIGN KEY ("parent_position_id") REFERENCES "society_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_position_assignments" ADD CONSTRAINT "society_position_assignments_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "society_memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_position_assignments" ADD CONSTRAINT "society_position_assignments_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "society_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_announcements" ADD CONSTRAINT "society_announcements_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_announcements" ADD CONSTRAINT "society_announcements_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
