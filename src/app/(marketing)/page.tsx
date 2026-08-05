import { Hero } from "@/components/marketing/hero"
import { PopularCategories } from "@/components/marketing/popular-categories"
import { FeaturedCompanies } from "@/components/marketing/featured-companies"
import { FeaturedJobs } from "@/components/marketing/featured-jobs"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { StatsCounter } from "@/components/marketing/stats-counter"
import { Benefits } from "@/components/marketing/benefits"
import { Testimonials } from "@/components/marketing/testimonials"
import { CtaSection } from "@/components/marketing/cta-section"
import { listAllCategories } from "@/services/job-posting/job-posting-public.service"

export default async function HomePage() {
  const categories = await listAllCategories()

  return (
    <>
      <Hero categories={categories} />
      <PopularCategories />
      <FeaturedCompanies />
      <FeaturedJobs />
      <HowItWorks />
      <StatsCounter />
      <Benefits />
      <Testimonials />
      <CtaSection />
    </>
  )
}
