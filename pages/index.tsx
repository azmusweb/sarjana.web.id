import { GetServerSideProps } from "next";
import Head from "next/head";
import { getConfig, getLivePosts } from "../lib/googleSheet";
import Header from "../components/Header";
import BreakingNewsTicker from "../components/BreakingNewsTicker";
import NewsSlider from "../components/NewsSlider";
import Footer from "../components/Footer";

export default function Home({ config, posts }: any) {
  return (
    <>
      <Head>
        <title>{config["meta-title-home"] || "SARJANA"}</title>
        <meta name="description" content={config["meta-deskripsi-home"]} />
        <link rel="icon" href={config["favicon-link"]} />
      </Head>
      <BreakingNewsTicker news={posts.slice(0, 5)} />
      <Header config={config} />
      <NewsSlider posts={posts} />
      <main style={{ display: "flex", margin: "24px" }}>
        <aside style={{ flex: 1, marginRight: "24px" }}>
          {/* Widget kiri */}
        </aside>
        <section style={{ flex: 2 }}>
          {posts.slice(0, 8).map((post: any) => (
            <div key={post.Slug} style={{ marginBottom: "18px", background: "#fff", borderRadius: 8, padding: 16 }}>
              <a href={`/${post.Slug}`}>
                <h2 style={{ margin: 0 }}>{post.Judul}</h2>
              </a>
              <div style={{ fontSize: 12, color: "#888" }}>{post.Label} | {post["Tgl/Jam"]}</div>
              <img src={post.Gambar} alt={post.Judul} style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8 }} />
              <div dangerouslySetInnerHTML={{ __html: post["Body/Isi Berita"]?.slice(0, 220) + "..." }} />
            </div>
          ))}
        </section>
        <aside style={{ flex: 1, marginLeft: "24px" }}>
          {/* Widget kanan */}
        </aside>
      </main>
      {/* Widget bawah posting */}
      <Footer config={config} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [config, posts] = await Promise.all([getConfig(), getLivePosts()]);
  return {
    props: { config, posts },
  };
};