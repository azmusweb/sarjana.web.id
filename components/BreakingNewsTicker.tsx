import Link from "next/link";

type Props = { news: { Judul: string, Slug: string }[] };

export default function BreakingNewsTicker({ news }: Props) {
  return (
    <div className="breaking-news">
      <span>Breaking News:</span>
      <marquee>
        {news.map((item, idx) => (
          <Link key={idx} href={`/${item.Slug}`}>{item.Judul}</Link>
        ))}
      </marquee>
      <style jsx>{`
        .breaking-news {
          background: var(--warna-utama, #2a7be4);
          color: #fff;
          padding: 6px 16px;
          font-weight: bold;
        }
        marquee a { margin-right: 32px; color: #fff; }
      `}</style>
    </div>
  );
}