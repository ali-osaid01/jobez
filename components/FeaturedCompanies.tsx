"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Company {
  id: string
  name: string
  industry: string
  logo: string
}

/* Component Data */

const featuredCompanies: Company[] = [
  {
    id: "google",
    name: "Google",
    industry: "Software & IT",
    logo: "/companies/google.png",
  },
  {
    id: "openai",
    name: "OpenAI",
    industry: "AI & Machine Learning",
    logo: "/companies/openai.png",
  },
  {
    id: "reown",
    name: "Reown Technologies",
    industry: "Software & IT",
    logo: "/companies/reown.png",
  },
  {
    id: "codecrafters",
    name: "CodeCrafters",
    industry: "Software & IT",
    logo: "/companies/codecrafters.png",
  },
  {
    id: "techhive",
    name: "TechHive Solutions",
    industry: "Software & IT",
    logo: "/companies/techhive.png",
  },
   {
    id: "techhive",
    name: "TechHive Solutions",
    industry: "Software & IT",
    logo: "/companies/techhive2.png",
  },
]

/* ================= COMPONENT ================= */

export function FeaturedCompanies() {
  return (
    <section className="py-12">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Featured Companies</h2>
        <p className="text-muted-foreground">
          Explore opportunities at leading companies
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredCompanies.map((company) => (
          <Card
            key={company.id}
            className="hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                
                {/* Logo */}
                <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-muted mb-4">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Info */}
                <h3 className="font-semibold text-lg">{company.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {company.industry}
                </p>
                  {/* cta button */}
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/companies/${company.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-full bg-[#009DFF] px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-[#0086DB]/90 transition"
          >
              View All Companies →
          </Link>
            </div>
      </div>
    </section>
  )
}
export default FeaturedCompanies
