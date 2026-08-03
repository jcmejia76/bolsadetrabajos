import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { getCandidateProfile } from "@/services/candidate/candidate.service";

type CandidateWithRelations = Awaited<ReturnType<typeof getCandidateProfile>>;

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  header: { marginBottom: 16 },
  name: { fontSize: 20, fontWeight: 700 },
  subtitle: { fontSize: 12, color: "#444", marginTop: 2 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 8 },
  contactItem: { fontSize: 9, color: "#555" },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    paddingBottom: 2,
    borderBottom: "1 solid #cccccc",
  },
  itemRow: { marginBottom: 6 },
  itemTitle: { fontSize: 10, fontWeight: 700 },
  itemSubtitle: { fontSize: 9, color: "#444" },
  itemMeta: { fontSize: 8, color: "#777" },
  itemDescription: { fontSize: 9, marginTop: 2 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  chip: {
    fontSize: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
});

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es", { month: "short", year: "numeric" });
}

export function CvPdfDocument({ candidate }: { candidate: CandidateWithRelations }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {candidate.firstName} {candidate.lastName}
          </Text>
          {candidate.profession && <Text style={styles.subtitle}>{candidate.profession}</Text>}
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{candidate.user.email}</Text>
            {candidate.phone && <Text style={styles.contactItem}>{candidate.phone}</Text>}
            {candidate.address && <Text style={styles.contactItem}>{candidate.address}</Text>}
            {candidate.nationality && <Text style={styles.contactItem}>{candidate.nationality}</Text>}
          </View>
        </View>

        {candidate.aboutMe && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre mí</Text>
            <Text style={styles.itemDescription}>{candidate.aboutMe}</Text>
          </View>
        )}

        {candidate.workExperiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiencia laboral</Text>
            {candidate.workExperiences.map((exp) => (
              <View key={exp.id} style={styles.itemRow}>
                <Text style={styles.itemTitle}>
                  {exp.position} — {exp.company}
                </Text>
                <Text style={styles.itemMeta}>
                  {formatDate(exp.startDate)} - {exp.isCurrent ? "Presente" : formatDate(exp.endDate)}
                </Text>
                {exp.description && <Text style={styles.itemDescription}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {candidate.educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Educación</Text>
            {candidate.educations.map((edu) => (
              <View key={edu.id} style={styles.itemRow}>
                <Text style={styles.itemTitle}>
                  {edu.degree}
                  {edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}
                </Text>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                <Text style={styles.itemMeta}>
                  {formatDate(edu.startDate)} - {edu.isCurrent ? "Presente" : formatDate(edu.endDate)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {candidate.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certificaciones</Text>
            {candidate.certifications.map((cert) => (
              <View key={cert.id} style={styles.itemRow}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                {cert.issuer && <Text style={styles.itemSubtitle}>{cert.issuer}</Text>}
                {cert.issuedAt && (
                  <Text style={styles.itemMeta}>Emitido: {formatDate(cert.issuedAt)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {candidate.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Idiomas</Text>
            <View style={styles.chipsRow}>
              {candidate.languages.map((lang) => (
                <Text key={lang.id} style={styles.chip}>
                  {lang.language} ({lang.level})
                </Text>
              ))}
            </View>
          </View>
        )}

        {candidate.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.chipsRow}>
              {candidate.skills.map((skill) => (
                <Text key={skill} style={styles.chip}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function renderCvPdf(candidate: CandidateWithRelations): Promise<Buffer> {
  return renderToBuffer(<CvPdfDocument candidate={candidate} />);
}
