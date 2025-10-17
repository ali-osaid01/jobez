export default function Greeting({ name }: { name: string }) {
  return (
    <h1 className="text-2xl font-semibold">
      Hello, {name}! 👋
    </h1>
  );
}
