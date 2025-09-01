-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE');

-- CreateEnum
CREATE TYPE "public"."RegistrationState" AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."CourseState" AS ENUM ('PROMOTED', 'REGULAR', 'FREE');

-- CreateEnum
CREATE TYPE "public"."FourMonth" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FOURTH');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "id" UUID NOT NULL,
    "dateBirth" TIMESTAMPTZ(3),
    "dni" TEXT,
    "phone" VARCHAR(20),
    "address" VARCHAR(50),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),
    "userId" UUID NOT NULL,
    "registrationState" "public"."RegistrationState" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."teachers" (
    "id" UUID NOT NULL,
    "dateBirth" TIMESTAMPTZ(3),
    "dni" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "address" VARCHAR(50),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),
    "userId" UUID NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."matriculations" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),
    "registrationState" "public"."RegistrationState" NOT NULL DEFAULT 'PENDING',
    "courseState" "public"."CourseState",
    "studentId" UUID NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "matriculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."qualifications" (
    "id" UUID NOT NULL,
    "note" DECIMAL(2,2) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),
    "qualificationDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qualificationStateId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "qualifications_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "public"."attendances" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),
    "attendanceDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendanceState" "public"."AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "studentId" UUID NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "year" INTEGER NOT NULL,
    "fourMonth" "public"."FourMonth" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),
    "careerId" UUID NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."careers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_QualificationStateToQualification" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_QualificationStateToQualification_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_StudentCourses" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_StudentCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_TeacherCourses" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_TeacherCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_StudentCareers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_StudentCareers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_id_email_idx" ON "public"."users"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "students_dni_key" ON "public"."students"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "public"."students"("userId");

-- CreateIndex
CREATE INDEX "students_id_dni_idx" ON "public"."students"("id", "dni");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_dni_key" ON "public"."teachers"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "public"."teachers"("userId");

-- CreateIndex
CREATE INDEX "teachers_id_idx" ON "public"."teachers"("id");

-- CreateIndex
CREATE INDEX "matriculations_id_idx" ON "public"."matriculations"("id");

-- CreateIndex
CREATE INDEX "qualifications_id_idx" ON "public"."qualifications"("id");

-- CreateIndex
CREATE INDEX "qualification_states_id_idx" ON "public"."qualification_states"("id");

-- CreateIndex
CREATE INDEX "attendances_id_idx" ON "public"."attendances"("id");

-- CreateIndex
CREATE INDEX "courses_id_year_fourMonth_idx" ON "public"."courses"("id", "year", "fourMonth");

-- CreateIndex
CREATE INDEX "careers_id_idx" ON "public"."careers"("id");

-- CreateIndex
CREATE INDEX "_QualificationStateToQualification_B_index" ON "public"."_QualificationStateToQualification"("B");

-- CreateIndex
CREATE INDEX "_StudentCourses_B_index" ON "public"."_StudentCourses"("B");

-- CreateIndex
CREATE INDEX "_TeacherCourses_B_index" ON "public"."_TeacherCourses"("B");

-- CreateIndex
CREATE INDEX "_StudentCareers_B_index" ON "public"."_StudentCareers"("B");

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."matriculations" ADD CONSTRAINT "matriculations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."matriculations" ADD CONSTRAINT "matriculations_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."qualifications" ADD CONSTRAINT "qualifications_qualificationStateId_fkey" FOREIGN KEY ("qualificationStateId") REFERENCES "public"."qualification_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."qualifications" ADD CONSTRAINT "qualifications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."qualifications" ADD CONSTRAINT "qualifications_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendances" ADD CONSTRAINT "attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendances" ADD CONSTRAINT "attendances_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "public"."careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_QualificationStateToQualification" ADD CONSTRAINT "_QualificationStateToQualification_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."qualifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_QualificationStateToQualification" ADD CONSTRAINT "_QualificationStateToQualification_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."qualification_states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentCourses" ADD CONSTRAINT "_StudentCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentCourses" ADD CONSTRAINT "_StudentCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeacherCourses" ADD CONSTRAINT "_TeacherCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeacherCourses" ADD CONSTRAINT "_TeacherCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentCareers" ADD CONSTRAINT "_StudentCareers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."careers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentCareers" ADD CONSTRAINT "_StudentCareers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
