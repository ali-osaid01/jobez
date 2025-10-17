export default function RecentActivity({ activities }: { activities: any[] }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="font-semibold mb-3">Recent Activity</h2>
      {activities.map((a) => (
        <p key={a.id} className="text-sm text-gray-700">• {a.text}</p>
      ))}
    </div>
  );
}
