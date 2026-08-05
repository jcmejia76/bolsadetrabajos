-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorite_jobPostingId_idx" ON "Favorite"("jobPostingId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_candidateId_jobPostingId_key" ON "Favorite"("candidateId", "jobPostingId");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
