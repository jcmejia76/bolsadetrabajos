import { requireRole } from "@/lib/auth-utils";
import { Role } from "@/generated/prisma/enums";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(Role.ADMINISTRADOR);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Panel de Administrador</h1>
      </header>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
