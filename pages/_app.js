import 'tailwindcss/tailwind.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>SARJANA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        {/* Meta dinamis bisa diatur per halaman */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}