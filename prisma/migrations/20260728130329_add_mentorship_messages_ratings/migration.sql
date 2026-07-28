-- CreateTable
CREATE TABLE "mentorship_messages" (
    "id" UUID NOT NULL,
    "mentorship_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentorship_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorship_ratings" (
    "id" UUID NOT NULL,
    "mentorship_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "educator_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentorship_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mentorship_messages_mentorship_id_created_at_idx" ON "mentorship_messages"("mentorship_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "mentorship_ratings_mentorship_id_key" ON "mentorship_ratings"("mentorship_id");

-- AddForeignKey
ALTER TABLE "mentorship_messages" ADD CONSTRAINT "mentorship_messages_mentorship_id_fkey" FOREIGN KEY ("mentorship_id") REFERENCES "mentorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_messages" ADD CONSTRAINT "mentorship_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_ratings" ADD CONSTRAINT "mentorship_ratings_mentorship_id_fkey" FOREIGN KEY ("mentorship_id") REFERENCES "mentorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
