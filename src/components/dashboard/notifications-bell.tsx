"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { RecentNotification } from "@/services/notification/notification.service";
import { markNotificationReadAction, markAllNotificationsReadAction } from "@/lib/actions/notifications";

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Ahora mismo";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} día${days === 1 ? "" : "s"}`;
}

interface NotificationsBellProps {
  notifications: RecentNotification[];
  unreadCount: number;
}

function NotificationsBell({ notifications, unreadCount }: NotificationsBellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markNotificationReadAction(id);
      router.refresh();
    });
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      router.refresh();
    });
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones" />
        }
      >
        <BellIcon className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-primary" />
        )}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-80 max-h-[70vh] overflow-y-auto p-0">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notificaciones</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
              onClick={handleMarkAllRead}
              disabled={isPending}
            >
              <CheckCheckIcon className="size-3.5" />
              Marcar todas
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tienes notificaciones todavía.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => !notification.isRead && handleMarkRead(notification.id)}
                  className={cn(
                    "flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-accent",
                    !notification.isRead && "bg-primary/5"
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {!notification.isRead && (
                      <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                    {notification.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{notification.message}</span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { NotificationsBell };
