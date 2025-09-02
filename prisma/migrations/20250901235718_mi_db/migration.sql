/*
  Warnings:

  - Added the required column `dni` to the `students` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dni` on the `teachers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."students" DROP COLUMN "dni",
ADD COLUMN     "dni" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."teachers" DROP COLUMN "dni",
ADD COLUMN     "dni" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_dni_key" ON "public"."students"("dni");

-- CreateIndex
CREATE INDEX "students_id_dni_idx" ON "public"."students"("id", "dni");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_dni_key" ON "public"."teachers"("dni");
