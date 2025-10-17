export default function DeadlinesWidget({ deadlines }: { deadlines: any[] }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="font-semibold mb-3">Upcoming Deadlines</h2>
      {deadlines.length > 0 ? (
        deadlines.map((d) => (
          <p key={d.id}>{d.title} — {d.date}</p>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No upcoming deadlines.</p>
      )}
    </div>
  );
}
