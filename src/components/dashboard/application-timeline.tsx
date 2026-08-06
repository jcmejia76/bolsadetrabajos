import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_ICONS,
  APPLICATION_STATUS_DESCRIPTIONS,
} from "@/lib/application-labels";
import { ApplicationStatus } from "@/generated/prisma/enums";

interface TimelineEvent {
  id: string;
  toStatus: ApplicationStatus;
  note: string | null;
  createdAt: Date;
}

interface ApplicationTimelineProps {
  events: TimelineEvent[];
}

const REJECTED_STATUSES = new Set<ApplicationStatus>([ApplicationStatus.RECHAZADO]);

export function ApplicationTimeline({ events }: ApplicationTimelineProps) {
  return (
    <ol className="flex flex-col md:w-full md:flex-row md:items-start">
      {events.map((event, index) => {
        const Icon = APPLICATION_STATUS_ICONS[event.toStatus];
        const isLast = index === events.length - 1;
        const isRejected = REJECTED_STATUSES.has(event.toStatus);
        const isHired = event.toStatus === ApplicationStatus.CONTRATADO;

        return (
          <li key={event.id} className="flex min-w-0 gap-4 md:flex-1 md:flex-col md:items-center md:gap-0">
            <div className="flex flex-col items-center md:w-full md:flex-row">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2",
                  isRejected
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : isHired
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/40 bg-primary/10 text-primary"
                )}
              >
                <Icon className="size-4.5" />
              </span>
              {!isLast && <span className="w-px flex-1 bg-border md:h-px md:w-auto" />}
            </div>

            <div
              className={cn(
                "flex min-w-0 flex-col gap-1 md:mt-3 md:w-full md:max-w-56 md:items-center md:px-2 md:text-center",
                isLast ? "pb-1 md:pb-0" : "pb-8 md:pb-0"
              )}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 md:flex-col md:items-center md:gap-x-0 md:gap-y-0.5">
                <span className="font-semibold text-foreground">
                  {APPLICATION_STATUS_LABELS[event.toStatus]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(event.createdAt).toLocaleString("es", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {event.note || APPLICATION_STATUS_DESCRIPTIONS[event.toStatus]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
