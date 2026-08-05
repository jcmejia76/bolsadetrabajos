-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "color" TEXT,
ADD COLUMN     "initials" TEXT;

-- AlterTable
ALTER TABLE "JobPosting" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;
