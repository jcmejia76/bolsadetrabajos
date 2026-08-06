import { ChangePasswordForm } from "@/components/dashboard/change-password-form";

export default function CuentaPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mi cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra la seguridad de tu cuenta.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
