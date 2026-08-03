import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, InfoIcon } from "lucide-react";

import { requireCandidateSession } from "@/lib/auth-utils";
import { getCvForCandidate } from "@/services/cv/cv.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CV_STATUS_LABELS, CV_SOURCE_LABELS } from "@/lib/candidate-labels";
import { CvDetailActions } from "./cv-detail-actions";

export default async function CvDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { candidateId } = await requireCandidateSession();

  const cv = await getCvForCandidate(candidateId, id);
  if (!cv) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/candidato/cv"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Volver a mis CVs
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{cv.fileName}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{CV_SOURCE_LABELS[cv.sourceType]}</span>
            <span>· v{cv.version}</span>
            <Badge variant="outline">{CV_STATUS_LABELS[cv.status]}</Badge>
            {cv.isPrimary && <Badge>Principal</Badge>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" render={<a href={cv.fileUrl} download={cv.fileName} />} nativeButton={false}>
            Descargar
          </Button>
          <CvDetailActions cvId={cv.id} cvFileName={cv.fileName} isPrimary={cv.isPrimary} />
        </div>
      </div>

      {cv.reviewReason && (
        <Alert>
          <InfoIcon />
          <AlertDescription>Motivo de revisión: {cv.reviewReason}</AlertDescription>
        </Alert>
      )}

      <div className="overflow-hidden rounded-2xl border border-border">
        <iframe src={cv.fileUrl} className="h-[80vh] w-full" title={cv.fileName} />
      </div>
    </div>
  );
}
