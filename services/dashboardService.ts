import { DashboardData } from "@/interfaces/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  // mock API simulation
  return {
    profileCompletion: 75,
    recommendedJobs: [
      {
        id: "1",
        title: "Frontend Developer",
        company: "Techify",
        deadline: "2025-11-01",
      },
      {
        id: "2",
        title: "UI/UX Designer",
        company: "DesignPro",
        deadline: "2025-11-05",
      },
    ],
    deadlines: [{ id: "d1", title: "Job Application", date: "2025-11-03" }],
    interviews: [{ id: "i1", company: "Techify", date: "2025-11-06" }],
    recentActivity: [
      { id: "a1", text: "Updated profile information" },
      { id: "a2", text: "Applied for Frontend Developer" },
    ],
  };
}
