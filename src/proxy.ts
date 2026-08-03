import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { Role, CompanyStatus } from "@/generated/prisma/enums";

const { auth } = NextAuth(authConfig);

const ROLE_ROUTES: Record<string, Role> = {
  "/admin": Role.ADMINISTRADOR,
  "/empresa": Role.EMPRESA,
  "/candidato": Role.CANDIDATO,
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const prefix = Object.keys(ROLE_ROUTES).find((p) => pathname.startsWith(p));
  if (!prefix) return NextResponse.next();

  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.user.role !== ROLE_ROUTES[prefix]) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (
    prefix === "/empresa" &&
    session.user.companyStatus !== CompanyStatus.APROBADA &&
    !pathname.startsWith("/empresa/pendiente")
  ) {
    return NextResponse.redirect(new URL("/empresa/pendiente", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/empresa/:path*", "/candidato/:path*"],
};
