export default function BreakingNews({ posts }) {
  const text = posts.slice(0, 5).map(p => p.Judul).join(" • ");
  return (
    <div className="w-full bg-red-500 text-white py-2 font-semibold">
      <marquee>{text}</marquee>
    </div>
  );
}