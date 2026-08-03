import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    { label: "Empresas registradas", value: cards.empresasRegistradas },
    { label: "Empresas pendientes", value: cards.empresasPendientes },
    { label: "Candidatos registrados", value: cards.candidatosRegistrados },
    { label: "CVs pendientes", value: cards.cvsPendientes },
    { label: "Ofertas activas", value: cards.ofertasActivas },
    { label: "Ofertas pendientes", value: cards.ofertasPendientes },
    { label: "Ofertas rechazadas", value: cards.ofertasRechazadas },
    { label: "Postulaciones", value: cards.postulaciones },
    { label: "Nuevos usuarios (30 días)", value: cards.nuevosUsuarios },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Panel de Administrador</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cardItems.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{item.value}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vacantes por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <JobsByCategoryChart data={vacantesPorCategoria} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empresas más activas</CardTitle>
          </CardHeader>
          <CardContent>
            <TopCompaniesChart data={empresasMasActivas} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Postulaciones por día (30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsByDayChart data={postulacionesPorDia} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevos registros (30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <NewRegistrationsChart data={nuevosRegistros} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contrataciones (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <HiresChart data={contrataciones} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
