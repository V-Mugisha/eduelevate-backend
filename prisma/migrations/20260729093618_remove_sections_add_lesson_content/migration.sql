/*
  Warnings:

  - You are about to drop the `sections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_lesson_id_fkey";

-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "content" TEXT;

-- DropTable
DROP TABLE "sections";
