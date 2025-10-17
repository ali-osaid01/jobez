export default function RecommendedJobs({ jobs }: { jobs: any[] }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="font-semibold mb-3">Recommended Jobs</h2>
      {jobs.map((job) => (
        <div key={job.id} className="mb-2">
          <p className="font-medium">{job.title}</p>
          <p className="text-sm text-gray-500">{job.company}</p>
          <p className="text-xs text-gray-400">Deadline: {job.deadline}</p>
        </div>
      ))}
    </div>
  );
}
