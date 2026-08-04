import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { generateSlugCandidate } from "@/lib/slug";
import { Role, CompanyStatus, Prisma } from "@/generated/prisma/client";

const MAX_SLUG_ATTEMPTS = 3;

function isUniqueConstraintError(e: unknown, field: string): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === "P2002" &&
    ((e.meta?.target as string[] | undefined)?.includes(field) ?? false)
  );
}

export async function registerCandidate(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const passwordHash = await hashPassword(input.password);

  try {
    return await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: Role.CANDIDATO,
        candidate: {
          create: {
            firstName: input.firstName,
            lastName: input.lastName,
          },
        },
      },
    });
  } catch (e) {
    if (isUniqueConstraintError(e, "email")) {
      throw new Error("Ya existe una cuenta con este correo");
    }
    throw e;
  }
}

export async function registerCompany(input: { email: string; password: string; name: string }) {
  const passwordHash = await hashPassword(input.password);

  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    try {
      return await prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: Role.EMPRESA,
          company: {
            create: {
              name: input.name,
              slug: generateSlugCandidate(input.name),
              email: input.email,
              status: CompanyStatus.PENDIENTE,
            },
          },
        },
      });
    } catch (e) {
      if (isUniqueConstraintError(e, "slug") && attempt < MAX_SLUG_ATTEMPTS - 1) continue;
      if (isUniqueConstraintError(e, "email")) {
        throw new Error("Ya existe una cuenta con este correo");
      }
      throw e;
    }
  }

  throw new Error("No se pudo completar el registro, intenta de nuevo");
}
