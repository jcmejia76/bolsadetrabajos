import type { Metadata } from "next";
import { requireCompanySession } from "@/lib/auth-utils";
import { getCompanyById } from "@/services/company/company.service";
import { CompanyProfileForm } from "./company-profile-form";
import type { CompanyProfileInput } from "@/validations/company.schema";

export const metadata: Metadata = {
  title: "Mi Empresa | Bolsa de Trabajos",
};

export default async function EmpresaPerfilPage() {
  const { companyId } = await requireCompanySession();
  const company = await getCompanyById(companyId);
  if (!company) throw new Error("Empresa no encontrada");

  const defaultValues: CompanyProfileInput = {
    name: company.name,
    email: company.email,
    phone: company.phone ?? "",
    industry: company.industry ?? "",
    size: company.size ?? "",
    website: company.website ?? "",
    address: company.address ?? "",
    city: company.city ?? "",
    country: company.country ?? "",
    description: company.description ?? "",
    contactName: company.contactName ?? "",
    contactEmail: company.contactEmail ?? "",
    contactPhone: company.contactPhone ?? "",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mi Empresa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Esta información es la que ven los candidatos en tu perfil público.
        </p>
      </div>
      <CompanyProfileForm defaultValues={defaultValues} />
    </div>
  );
}
