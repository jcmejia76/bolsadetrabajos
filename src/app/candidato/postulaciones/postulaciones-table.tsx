"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, InfoIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_VARIANTS } from "@/lib/application-labels";
import { CV_STATUS_LABELS } from "@/lib/candidate-labels";
import { CVStatus } from "@/generated/prisma/enums";
import { ApplicationTimeline } from "@/components/dashboard/application-timeline";
import type { listApplicationsByCandidate } from "@/services/application/application.service";

type Application = Awaited<ReturnType<typeof listApplicationsByCandidate>>[number];

function formatRelativeDays(days: number) {
  if (days <= 0) return "Hoy";
  if (days === 1) return "Hace 1 día";
  return `Hace ${days} días`;
}

function daysSince(date: Date) {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
}

export function PostulacionesTable({ applications }: { applications: Application[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Empleo</TableHead>
            <TableHead className="px-4 py-3">Empresa</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3">Postulado</TableHead>
            <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const isExpanded = expandedId === application.id;
            return (
              <Fragment key={application.id}>
                <TableRow>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
                        style={{
                          backgroundColor: application.jobPosting.company.color ?? "oklch(0.56 0.17 258)",
                        }}
                      >
                        {application.jobPosting.company.initials ?? "?"}
                      </span>
                      <Link
                        href={`/empleos/${application.jobPosting.slug}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {application.jobPosting.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {application.jobPosting.company.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant={APPLICATION_STATUS_VARIANTS[application.status]}>
                      {APPLICATION_STATUS_LABELS[application.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {formatRelativeDays(daysSince(application.appliedAt))}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(isExpanded ? null : application.id)}
                    >
                      Ver seguimiento
                      <ChevronDownIcon
                        className={cn("size-4 transition-transform", isExpanded && "rotate-180")}
                      />
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="whitespace-normal p-0">
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-4 bg-muted/30 px-6 py-6">
                            {application.cv.status !== CVStatus.APROBADO && (
                              <Alert className="md:max-w-2xl">
                                <InfoIcon />
                                <AlertDescription>
                                  El CV que usaste para esta postulación ({application.cv.fileName}) está{" "}
                                  {CV_STATUS_LABELS[application.cv.status].toLowerCase()} por nuestro equipo
                                  {application.cv.reviewReason ? `: ${application.cv.reviewReason}` : "."}
                                </AlertDescription>
                              </Alert>
                            )}
                            <ApplicationTimeline events={application.statusEvents} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
