export default function InterviewTasks({ interviews }: { interviews: any[] }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="font-semibold mb-3">Interviews</h2>
      {interviews.length > 0 ? (
        interviews.map((i) => (
          <p key={i.id}>{i.company} — {i.date}</p>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No interviews scheduled.</p>
      )}
    </div>
  );
}
