import { Suspense } from "react";
import Link from "next/link";
import { BriefcaseBusinessIcon } from "lucide-react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main id="main-content" className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden bg-grid-fade p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]"
      />
      <Link href="/" className="relative z-10 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BriefcaseBusinessIcon className="size-4.5" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Bolsa de Trabajos
        </span>
      </Link>
      <div className="relative z-10">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
