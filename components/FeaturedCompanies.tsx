"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Company {
  id: string
  name: string
  industry: string
  logo: string
}

const featuredCompanies: Company[] = [
  {
    id: "1",
    name: "Google",
    industry: "Software & IT",
    logo: "https://logo.clearbit.com/google.com",
  },
  {
    id: "2",
    name: "OpenAI",
    industry: "AI & Machine Learning",
    logo: "https://logo.clearbit.com/openai.com",
  },
  {
    id: "3",
    name: "Figma",
    industry: "Design & Creative",
    logo: "https://logo.clearbit.com/figma.com",
  },
  {
    id: "4",
    name: "AWS",
    industry: "Cloud Infrastructure",
    logo: "https://logo.clearbit.com/aws.amazon.com",
  },
  {
    id: "5",
    name: "Stripe",
    industry: "Fintech",
    logo: "https://logo.clearbit.com/stripe.com",
  },
]

export function FeaturedCompanies() {
  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Featured Companies</h2>
        <p className="text-muted-foreground">Explore opportunities at leading companies</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {featuredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  className="w-16 h-16 rounded-lg mb-4 object-contain bg-white p-2"
                  crossOrigin="anonymous"
                />

                {/* Company Info */}
                <h3 className="font-semibold text-lg mb-1">{company.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{company.industry}</p>

                {/* View Details Button */}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/companies/${company.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/companies" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
          View All Companies →
        </Link>
      </div>
    </section>
  )
}
