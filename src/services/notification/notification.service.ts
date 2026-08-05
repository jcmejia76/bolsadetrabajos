import { prisma } from "@/lib/prisma";
import { NotificationChannel, Prisma } from "@/generated/prisma/client";
import type { NotificationType } from "@/generated/prisma/enums";

type Db = typeof prisma | Prisma.TransactionClient;

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Prisma.InputJsonValue;
  channel?: NotificationChannel;
}

export async function createNotification(input: CreateNotificationInput, db: Db = prisma) {
  return db.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      metadata: input.metadata,
      channel: input.channel ?? NotificationChannel.IN_APP,
    },
  });
}

const RECENT_NOTIFICATIONS_LIMIT = 20;

export async function listRecentNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: RECENT_NOTIFICATIONS_LIMIT,
  });
}

export async function countUnreadNotifications(userId: string) {
  return prisma.notification.count({ where: { userId, isRead: false } });
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

export type RecentNotification = Awaited<ReturnType<typeof listRecentNotifications>>[number];
