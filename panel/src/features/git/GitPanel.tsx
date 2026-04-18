import GitChanges from "./GitChanges";

export default function GitPanel() {
  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-xl font-semibold mb-6">Changes</h1>
      <GitChanges showCommit />
    </div>
  );
}
