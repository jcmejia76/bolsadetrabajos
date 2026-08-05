"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, UsersIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StaffStatus } from "@/generated/prisma/enums";
import { STAFF_STATUS_LABELS, STAFF_STATUS_VARIANTS } from "@/lib/staff-labels";
import type { CompanyStaffMember } from "@/services/staff/staff.service";
import {
  suspendStaffMemberAction,
  reactivateStaffMemberAction,
  removeStaffMemberAction,
} from "./actions";

export function StaffTable({ staff }: { staff: CompanyStaffMember[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleAction(
    action: (id: string) => Promise<{ success: boolean; error?: string }>,
    id: string,
    successMessage: string
  ) {
    startTransition(async () => {
      const result = await action(id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(successMessage);
      router.refresh();
    });
  }

  if (staff.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon />}
        title="Todavía no has invitado a nadie"
        description="Invita a alguien de tu equipo para que te ayude a gestionar ofertas y postulaciones."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Correo</TableHead>
            <TableHead className="px-4 py-3">Puesto</TableHead>
            <TableHead className="px-4 py-3">Rol</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="px-4 py-3 font-medium text-foreground">
                {member.user.email}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {member.jobTitle ?? "—"}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{member.role.name}</TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant={STAFF_STATUS_VARIANTS[member.status]}>
                  {STAFF_STATUS_LABELS[member.status]}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                    <MoreVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.status === StaffStatus.ACTIVO && (
                      <DropdownMenuItem
                        disabled={isPending}
                        onClick={() =>
                          handleAction(suspendStaffMemberAction, member.id, "Miembro suspendido")
                        }
                      >
                        Suspender
                      </DropdownMenuItem>
                    )}
                    {member.status === StaffStatus.SUSPENDIDO && (
                      <DropdownMenuItem
                        disabled={isPending}
                        onClick={() =>
                          handleAction(reactivateStaffMemberAction, member.id, "Miembro reactivado")
                        }
                      >
                        Reactivar
                      </DropdownMenuItem>
                    )}
                    {member.status !== StaffStatus.ELIMINADO && (
                      <DropdownMenuItem
                        variant="destructive"
                        disabled={isPending}
                        onClick={() =>
                          handleAction(removeStaffMemberAction, member.id, "Miembro eliminado del equipo")
                        }
                      >
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
