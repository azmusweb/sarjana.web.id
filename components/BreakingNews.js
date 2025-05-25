export default function BreakingNews({ posts }) {
  const breaking = posts.slice(0, 5).map(p => p.Judul).join(" • ");
  return (
    <div className="w-full bg-red-600 text-white py-2 font-semibold">
      <marquee>{breaking}</marquee>
    </div>
  );
}