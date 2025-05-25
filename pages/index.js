import { getConfig, getPosts, getPopularPosts } from '../lib/gsheet'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BreakingNews from '../components/BreakingNews'
import Slider from '../components/Slider'
import Widget from '../components/Widget'

export async function getServerSideProps() {
  const config = await getConfig()
  const posts = await getPosts({ limit: 10 })
  const popular = await getPopularPosts(5)
  return { props: { config, posts, popular } }
}

export default function Home({ config, posts, popular }) {
  return (
    <div className="bg-white min-h-screen">
      <Header config={config} />
      <BreakingNews posts={posts} />
      <Slider posts={posts.slice(0, 5)} />
      <main className="container mx-auto flex flex-col md:flex-row mt-4">
        <aside className="md:w-1/4 px-2">
          <Widget title="Berita Populer" posts={popular} />
        </aside>
        <section className="md:w-2/4 px-2">
          <ul>
            {posts.map(post => (
              <li key={post.Slug} className="mb-4 border-b pb-2">
                <a href={`/${post.Slug}`} className="font-bold text-lg text-blue-700 hover:underline">{post.Judul}</a>
                <div className="text-sm text-gray-500 mb-1">{post["Tgl/Jam"]} | {post.Label}</div>
                {post.Gambar && (
                  <img src={post.Gambar} alt={post.Judul} className="w-full h-40 object-cover rounded mb-2" />
                )}
                <div dangerouslySetInnerHTML={{ __html: post["Body/Isi Berita"].slice(0, 150) + "..." }} />
              </li>
            ))}
          </ul>
        </section>
        <aside className="md:w-1/4 px-2">
          <Widget title="Label" type="label" />
          {/* Tambahkan widget lain jika perlu */}
        </aside>
      </main>
      {/* Widget bawah label */}
      <div className="container mx-auto mt-8">
        <Widget title="Label Pilihan" type="label" limit={4} />
      </div>
      <Footer config={config} />
    </div>
  )
}