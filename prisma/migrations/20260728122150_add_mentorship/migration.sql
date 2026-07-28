-- CreateTable
CREATE TABLE "mentorship_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "topics" TEXT[],
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentorship_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorship_applications" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "educator_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "topic" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentorship_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorships" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "educator_id" UUID NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "ended_by" TEXT,
    "end_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentorships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentorship_profiles_user_id_key" ON "mentorship_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mentorships_student_id_educator_id_key" ON "mentorships"("student_id", "educator_id");

-- AddForeignKey
ALTER TABLE "mentorship_profiles" ADD CONSTRAINT "mentorship_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_applications" ADD CONSTRAINT "mentorship_applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_applications" ADD CONSTRAINT "mentorship_applications_educator_id_fkey" FOREIGN KEY ("educator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorships" ADD CONSTRAINT "mentorships_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorships" ADD CONSTRAINT "mentorships_educator_id_fkey" FOREIGN KEY ("educator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
