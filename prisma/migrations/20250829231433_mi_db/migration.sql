/*
  Warnings:

  - The values [DEMOTED] on the enum `CourseState` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `name` on the `careers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `title` on the `careers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `name` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `qualificationState` on the `qualifications` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `students` table. All the data in the column will be lost.
  - You are about to alter the column `phone` on the `students` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `address` on the `students` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `age` on the `teachers` table. All the data in the column will be lost.
  - You are about to alter the column `phone` on the `teachers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `address` on the `teachers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Added the required column `description` to the `careers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `qualifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualificationStateId` to the `qualifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateBirth` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateBirth` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CourseState_new" AS ENUM ('PROMOTED', 'REGULAR', 'FREE');
ALTER TABLE "public"."matriculations" ALTER COLUMN "courseState" TYPE "public"."CourseState_new" USING ("courseState"::text::"public"."CourseState_new");
ALTER TYPE "public"."CourseState" RENAME TO "CourseState_old";
ALTER TYPE "public"."CourseState_new" RENAME TO "CourseState";
DROP TYPE "public"."CourseState_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."careers" ADD COLUMN     "description" VARCHAR(1000) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "public"."courses" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "public"."qualifications" DROP COLUMN "qualificationState",
ADD COLUMN     "note" DECIMAL(2,2) NOT NULL,
ADD COLUMN     "qualificationStateId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."students" DROP COLUMN "age",
ADD COLUMN     "dateBirth" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "public"."teachers" DROP COLUMN "age",
ADD COLUMN     "dateBirth" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(50);

-- DropEnum
DROP TYPE "public"."QualificationState";

-- CreateTable
CREATE TABLE "public"."qualification_states" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "note" DECIMAL(2,2) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "qualification_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_QualificationStateToQualification" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_QualificationStateToQualification_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "qualification_states_id_idx" ON "public"."qualification_states"("id");

-- CreateIndex
CREATE INDEX "_QualificationStateToQualification_B_index" ON "public"."_QualificationStateToQualification"("B");

-- CreateIndex
CREATE INDEX "attendances_id_idx" ON "public"."attendances"("id");

-- CreateIndex
CREATE INDEX "careers_id_idx" ON "public"."careers"("id");

-- CreateIndex
CREATE INDEX "courses_id_year_fourMonth_idx" ON "public"."courses"("id", "year", "fourMonth");

-- CreateIndex
CREATE INDEX "matriculations_id_idx" ON "public"."matriculations"("id");

-- CreateIndex
CREATE INDEX "qualifications_id_idx" ON "public"."qualifications"("id");

-- CreateIndex
CREATE INDEX "teachers_id_idx" ON "public"."teachers"("id");

-- AddForeignKey
ALTER TABLE "public"."qualifications" ADD CONSTRAINT "qualifications_qualificationStateId_fkey" FOREIGN KEY ("qualificationStateId") REFERENCES "public"."qualification_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_QualificationStateToQualification" ADD CONSTRAINT "_QualificationStateToQualification_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."qualifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_QualificationStateToQualification" ADD CONSTRAINT "_QualificationStateToQualification_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."qualification_states"("id") ON DELETE CASCADE ON UPDATE CASCADE;
