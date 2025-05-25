import { GetServerSideProps } from "next";
import Head from "next/head";
import { getConfig, getPostBySlug } from "../lib/googleSheet";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PostDetail({ config, post }: any) {
  if (!post) return <div>Berita tidak ditemukan.</div>;
  return (
    <>
      <Head>
        <title>{post.Judul} | {config["meta-title-home"] || "SARJANA"}</title>
        <meta name="description" content={post["Meta Deskripsi"]} />
      </Head>
      <Header config={config} />
      <main style={{ display: "flex", margin: "24px" }}>
        <section style={{ flex: 2 }}>
          <h1>{post.Judul}</h1>
          <div style={{ fontSize: 12, color: "#888" }}>{post.Label} | {post["Tgl/Jam"]}</div>
          <img src={post.Gambar} alt={post.Judul} style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8 }} />
          <div dangerouslySetInnerHTML={{ __html: post["Body/Isi Berita"] }} />
        </section>
        <aside style={{ flex: 1, marginLeft: "24px" }}>
          {/* Widget dinamis dari config */}
        </aside>
      </main>
      <Footer config={config} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug as string;
  const [config, post] = await Promise.all([getConfig(), getPostBySlug(slug)]);
  return { props: { config, post: post || null } };
};