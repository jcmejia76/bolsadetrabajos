import { requireCandidateSession } from "@/lib/auth-utils";
import { getCandidateProfile } from "@/services/candidate/candidate.service";
import { CandidateProfileForm } from "./candidate-profile-form";
import type { CandidateProfileFormValues } from "@/validations/candidate.schema";

function toDateInputValue(value: unknown): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export default async function PerfilPage() {
  const { candidateId } = await requireCandidateSession();
  const candidate = await getCandidateProfile(candidateId);

  const defaultValues: CandidateProfileFormValues = {
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    phone: candidate.phone ?? "",
    address: candidate.address ?? "",
    birthDate: toDateInputValue(candidate.birthDate) as never,
    gender: candidate.gender ?? "",
    nationality: candidate.nationality ?? "",
    aboutMe: candidate.aboutMe ?? "",
    profession: candidate.profession ?? "",
    availability: candidate.availability ?? "",
    salaryAspiration: candidate.salaryAspiration ? Number(candidate.salaryAspiration) : null,
    portfolioUrl: candidate.portfolioUrl ?? "",
    isProfilePublic: candidate.isProfilePublic,
    skills: candidate.skills,
    socialLinks: Array.isArray(candidate.socialLinks) ? (candidate.socialLinks as never) : [],
    references: Array.isArray(candidate.references) ? (candidate.references as never) : [],
    workExperiences: candidate.workExperiences.map((exp) => ({
      company: exp.company,
      position: exp.position,
      startDate: toDateInputValue(exp.startDate) as never,
      endDate: toDateInputValue(exp.endDate) as never,
      isCurrent: exp.isCurrent,
      description: exp.description ?? "",
    })),
    educations: candidate.educations.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy ?? "",
      startDate: toDateInputValue(edu.startDate) as never,
      endDate: toDateInputValue(edu.endDate) as never,
      isCurrent: edu.isCurrent,
    })),
    certifications: candidate.certifications.map((cert) => ({
      name: cert.name,
      issuer: cert.issuer ?? "",
      issuedAt: toDateInputValue(cert.issuedAt) as never,
      expiresAt: toDateInputValue(cert.expiresAt) as never,
      credentialUrl: cert.credentialUrl ?? "",
    })),
    languages: candidate.languages.map((lang) => ({
      language: lang.language,
      level: lang.level,
    })),
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mi perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mantén tu información actualizada para destacar ante los reclutadores.
        </p>
      </div>
      <CandidateProfileForm
        email={candidate.user.email}
        photoUrl={candidate.photoUrl}
        defaultValues={defaultValues}
      />
    </div>
  );
}
