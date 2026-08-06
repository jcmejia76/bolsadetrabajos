import { requireCompanySession } from "@/lib/auth-utils";
import { getUserPersonalProfile } from "@/services/user/user.service";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { PersonalProfileForm } from "@/components/dashboard/personal-profile-form";

export default async function CuentaPage() {
  const { userId } = await requireCompanySession();
  const profile = await getUserPersonalProfile(userId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mi cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra tus datos personales y la seguridad de tu cuenta de acceso.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <PersonalProfileForm
          email={profile.email}
          photoUrl={profile.photoUrl}
          defaultValues={{
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            phone: profile.phone ?? "",
            aboutMe: profile.aboutMe ?? "",
          }}
        />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
