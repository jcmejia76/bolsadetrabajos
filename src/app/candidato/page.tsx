import Link from "next/link";
import { FileTextIcon, PercentIcon, ClockIcon, FileIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { requireCandidateSession } from "@/lib/auth-utils";
import { getCandidateDashboardStats } from "@/services/candidate/candidate.service";
import { CV_STATUS_LABELS } from "@/lib/candidate-labels";

export default async function CandidatoDashboardPage() {
  const { candidateId } = await requireCandidateSession();
  const stats = await getCandidateDashboardStats(candidateId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Bienvenido de nuevo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Este es el resumen de tu actividad como candidato.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href="/candidato/perfil" />} nativeButton={false}>
            Completar mi perfil
          </Button>
          <Button render={<Link href="/candidato/cv" />} nativeButton={false}>
            Subir/Generar CV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="gap-3 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completitud del perfil</span>
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PercentIcon className="size-4.5" />
            </span>
          </div>
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {stats.completenessPct}%
          </span>
          <Progress value={stats.completenessPct}>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
        </Card>
        <StatCard label="Total de CVs" value={stats.cvCount} icon={<FileTextIcon />} />
        <StatCard
          label="CVs pendientes de revisión"
          value={stats.pendingCvCount}
          icon={<ClockIcon />}
        />
      </div>

      <Card className="max-w-md gap-4 p-5">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <FileIcon className="size-4 text-primary" />
            CV principal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stats.primaryCv ? (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm text-foreground">{stats.primaryCv.fileName}</span>
              <Badge variant="secondary">{CV_STATUS_LABELS[stats.primaryCv.status]}</Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aún no tienes un CV principal. Sube o genera uno desde tu perfil.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
