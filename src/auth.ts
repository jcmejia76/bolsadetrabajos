import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/validations/auth.schema";
import { StaffScope } from "@/generated/prisma/enums";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { logAudit } from "@/services/audit/audit.service";

// Precomputed bcrypt hash of an unused password, compared against on every
// "user not found" path so that branch costs the same as a real password
// check — otherwise the missing-vs-wrong-password timing gap leaks which
// emails are registered.
const DUMMY_PASSWORD_HASH = "$2b$12$efPVrqPMUTfNWWJUMFMpQeexejcEG7OmFecTkzxNB4mRrOppr1k0G";

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

        const { ipAddress, userAgent } = await getRequestMeta();
        const email = parsed.data.email;

        const withinIpLimit = checkRateLimit(`login:ip:${ipAddress ?? "unknown"}`, 30, 10 * 60 * 1000);
        const withinEmailLimit = checkRateLimit(`login:email:${email}`, 5, 10 * 60 * 1000);
        if (!withinIpLimit || !withinEmailLimit) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            company: true,
            candidate: true,
            staffAccount: { include: { company: true } },
          },
        });

        if (!user || !user.isActive) {
          // Keep the cost of this branch equal to the real one below.
          await verifyPassword(parsed.data.password, DUMMY_PASSWORD_HASH);
          return null;
        }

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

        await logAudit({
          actorId: user.id,
          action: "LOGIN",
          entityType: "User",
          entityId: user.id,
          ipAddress,
          userAgent,
        });

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
