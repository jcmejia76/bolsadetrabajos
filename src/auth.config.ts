import type { NextAuthConfig } from "next-auth";
import type { Role, CompanyStatus } from "@/generated/prisma/enums";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  // Explicit (not implicit via NEXTAUTH_URL detection) so the secure-cookie /
  // __Secure-__Host- prefix behavior is auditable directly from this file.
  useSecureCookies: process.env.NODE_ENV === "production",
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const authorizedUser = user as {
          name?: string | null;
          role: Role;
          companyId?: string;
          companyStatus?: CompanyStatus;
          candidateId?: string;
        };
        token.name = authorizedUser.name;
        token.role = authorizedUser.role;
        token.companyId = authorizedUser.companyId;
        token.companyStatus = authorizedUser.companyStatus;
        token.candidateId = authorizedUser.candidateId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.companyId = token.companyId;
      session.user.companyStatus = token.companyStatus;
      session.user.candidateId = token.candidateId;
      return session;
    },
  },
  providers: [],
};
