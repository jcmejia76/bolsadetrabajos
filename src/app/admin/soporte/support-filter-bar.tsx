"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupportRequestStatus } from "@/generated/prisma/enums";
import { SUPPORT_STATUS_LABELS } from "@/lib/support-request-labels";

const ALL_VALUE = "__all__";

export function SupportFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") ?? ALL_VALUE;

  function handleStatusChange(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL_VALUE) {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    params.delete("page");
    router.push(`/admin/soporte?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Todos los estados">
            {(value: string) => (value === ALL_VALUE ? "Todos los estados" : SUPPORT_STATUS_LABELS[value])}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todos los estados</SelectItem>
          {Object.values(SupportRequestStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {SUPPORT_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
