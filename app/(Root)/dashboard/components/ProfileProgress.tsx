export default function ProfileProgress({ progress }: { progress: number }) {
  return (
    <div className="w-48">
      <p className="text-sm text-gray-600 mb-1">Profile Completeness</p>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-700 mt-1">{progress}%</p>
    </div>
  );
}
