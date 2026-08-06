import { Hero } from "@/components/marketing/hero"
import { PopularCategories } from "@/components/marketing/popular-categories"
import { FeaturedCompanies } from "@/components/marketing/featured-companies"
import { FeaturedJobs } from "@/components/marketing/featured-jobs"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { StatsCounter } from "@/components/marketing/stats-counter"
import { Benefits } from "@/components/marketing/benefits"
import { Testimonials } from "@/components/marketing/testimonials"
import { CtaSection } from "@/components/marketing/cta-section"
import { getPlatformStats } from "@/services/stats/platform-stats.service"
import { listPublishedCompanies } from "@/services/company/company-public.service"

export default async function HomePage() {
  const [stats, companies] = await Promise.all([
    getPlatformStats(),
    listPublishedCompanies(),
  ])
  const heroCompanies = companies.slice(0, 4).map((c) => ({
    name: c.name,
    initials: c.initials ?? "?",
    color: c.color ?? "oklch(0.56 0.17 258)",
  }))

  return (
    <>
      <Hero
        jobsCount={stats.jobs}
        candidatesCount={stats.candidates}
        companies={heroCompanies}
      />
      <PopularCategories />
      <FeaturedCompanies />
      <FeaturedJobs />
      <HowItWorks />
      <StatsCounter />
      <Benefits companiesCount={stats.companies} />
      <Testimonials />
      <CtaSection />
    </>
  )
}
