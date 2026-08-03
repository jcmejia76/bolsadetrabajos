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
