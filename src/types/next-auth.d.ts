import type { Role, CompanyStatus } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface User {
    name?: string | null;
    role: Role;
    companyId?: string;
    companyStatus?: CompanyStatus;
    candidateId?: string;
  }

  interface Session {
    user: User & { id: string };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    name?: string | null;
    role: Role;
    companyId?: string;
    companyStatus?: CompanyStatus;
    candidateId?: string;
  }
}
