import { getConfig, getPostBySlug, getPopularPosts } from '../lib/gsheet'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Widget from '../components/Widget'

export async function getServerSideProps({ params }) {
  const config = await getConfig()
  const post = await getPostBySlug(params.slug)
  const popular = await getPopularPosts(5)
  return { props: { config, post, popular } }
}

export default function PostDetail({ config, post, popular }) {
  if (!post) return <div>404 Not Found</div>
  return (
    <div>
      <Header config={config} />
      <div className="container mx-auto flex flex-col md:flex-row mt-4">
        <main className="md:w-2/3 px-2">
          <h1 className="text-3xl font-bold mb-2">{post.Judul}</h1>
          <div className="mb-4 text-sm text-gray-500">{post["Tgl/Jam"]} | {post.Label}</div>
          {post.Gambar && (
            <img src={post.Gambar} className="w-full mb-4 rounded" alt={post.Judul} />
          )}
          <div dangerouslySetInnerHTML={{ __html: post["Body/Isi Berita"] }} />
        </main>
        <aside className="md:w-1/3 px-2">
          <Widget title="Berita Populer" posts={popular} />
          {/* Tambah widget dinamis lain jika perlu */}
        </aside>
      </div>
      <Footer config={config} />
    </div>
  )
}