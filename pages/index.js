import { getConfig, getPosts } from "../lib/gsheet";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slider from "../components/Slider";
import BreakingNews from "../components/BreakingNews";
import Widget from "../components/Widget";

export async function getStaticProps() {
  const config = await getConfig();
  const posts = await getPosts({ limit: 10 });
  // Ambil berita populer, label, dsb sesuai kebutuhan
  return { props: { config, posts } };
}

export default function Home({ config, posts }) {
  return (
    <div className="bg-white">
      <Header config={config} />
      <BreakingNews posts={posts} />
      <Slider posts={posts.slice(0, 5)} />
      <main className="container mx-auto flex flex-col md:flex-row">
        <aside className="md:w-1/4">
          <Widget type="populer" />
          {/* dsb */}
        </aside>
        <section className="md:w-2/4">
          {/* Render berita utama */}
        </section>
        <aside className="md:w-1/4">
          {/* Widget kanan */}
        </aside>
      </main>
      {/* Widget bawah (label) */}
      <Footer config={config} />
    </div>
  );
}