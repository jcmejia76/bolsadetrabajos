import {
  Building2Icon,
  ClockIcon,
  UsersIcon,
  FileTextIcon,
  TrendingUpIcon,
  HourglassIcon,
  XCircleIcon,
  SendIcon,
  UserPlusIcon,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import {
  getAdminDashboardCards,
  getVacantesPorCategoria,
  getEmpresasMasActivas,
  getPostulacionesPorDia,
  getNuevosRegistros,
  getContrataciones,
} from "@/services/admin/dashboard.service";
import { JobsByCategoryChart } from "./_components/charts/jobs-by-category-chart";
import { TopCompaniesChart } from "./_components/charts/top-companies-chart";
import { ApplicationsByDayChart } from "./_components/charts/applications-by-day-chart";
import { NewRegistrationsChart } from "./_components/charts/new-registrations-chart";
import { HiresChart } from "./_components/charts/hires-chart";

export default async function AdminDashboardPage() {
  const [cards, vacantesPorCategoria, empresasMasActivas, postulacionesPorDia, nuevosRegistros, contrataciones] =
    await Promise.all([
      getAdminDashboardCards(),
      getVacantesPorCategoria(),
      getEmpresasMasActivas(),
      getPostulacionesPorDia(),
      getNuevosRegistros(),
      getContrataciones(),
    ]);

  const cardItems = [
    { label: "Empresas registradas", value: cards.empresasRegistradas, icon: Building2Icon },
    { label: "Empresas pendientes", value: cards.empresasPendientes, icon: ClockIcon },
    { label: "Candidatos registrados", value: cards.candidatosRegistrados, icon: UsersIcon },
    { label: "CVs pendientes", value: cards.cvsPendientes, icon: FileTextIcon },
    { label: "Ofertas activas", value: cards.ofertasActivas, icon: TrendingUpIcon },
    { label: "Ofertas pendientes", value: cards.ofertasPendientes, icon: HourglassIcon },
    { label: "Ofertas rechazadas", value: cards.ofertasRechazadas, icon: XCircleIcon },
    { label: "Postulaciones", value: cards.postulaciones, icon: SendIcon },
    { label: "Nuevos usuarios (30 días)", value: cards.nuevosUsuarios, icon: UserPlusIcon },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Panel de Administrador</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general de la plataforma en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cardItems.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} icon={<item.icon />} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Vacantes por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <JobsByCategoryChart data={vacantesPorCategoria} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Empresas más activas</CardTitle>
          </CardHeader>
          <CardContent>
            <TopCompaniesChart data={empresasMasActivas} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Postulaciones por día (30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsByDayChart data={postulacionesPorDia} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Nuevos registros (30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <NewRegistrationsChart data={nuevosRegistros} />
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Contrataciones (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <HiresChart data={contrataciones} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
