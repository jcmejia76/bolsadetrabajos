import { Suspense } from "react";
import { AuthLogo } from "@/components/layout/auth-logo";
import { getSiteBranding } from "@/services/settings/site-settings.service";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const { logoUrl } = await getSiteBranding();

  return (
    <main id="main-content" className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden bg-grid-fade p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]"
      />
      <AuthLogo logoUrl={logoUrl} />
      <div className="relative z-10 flex w-full justify-center">
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
