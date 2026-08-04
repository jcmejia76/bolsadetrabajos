import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/validations/auth.schema";
import { StaffScope } from "@/generated/prisma/enums";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: {
            company: true,
            candidate: true,
            staffAccount: { include: { company: true } },
          },
        });
        if (!user || !user.isActive) return null;

        const valid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        // Company staff members don't own a Company row themselves — resolve
        // their employer's id/status through the StaffMember relation instead.
        const staffCompany =
          user.staffAccount?.scope === StaffScope.EMPRESA ? user.staffAccount.company : null;
        const company = user.company ?? staffCompany;
        const name =
          company?.name ??
          (user.candidate ? `${user.candidate.firstName} ${user.candidate.lastName}` : null);

        return {
          id: user.id,
          email: user.email,
          name,
          role: user.role,
          companyId: company?.id,
          companyStatus: company?.status,
          candidateId: user.candidate?.id,
        };
      },
    }),
  ],
});
