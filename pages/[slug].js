import { getPostBySlug, getConfig } from "../lib/gsheet";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Widget from "../components/Widget";

export async function getServerSideProps({ params }) {
  const post = await getPostBySlug(params.slug);
  const config = await getConfig();
  return { props: { post, config } };
}

export default function PostDetail({ post, config }) {
  if (!post) return <div>404 Not Found</div>;
  return (
    <div>
      <Header config={config} />
      <div className="container mx-auto flex flex-col md:flex-row">
        <section className="md:w-2/3 p-4">
          <h1 className="text-3xl font-bold">{post.Judul}</h1>
          <div dangerouslySetInnerHTML={{ __html: post["Body/Isi Berita"] }} />
        </section>
        <aside className="md:w-1/3 p-4">
          <Widget type="populer" />
          {/* Widget dinamis lain */}
        </aside>
      </div>
      <Footer config={config} />
    </div>
  );
}