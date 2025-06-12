// pages/index.js
import Head from "next/head";
import { fetchKampusData } from "@/lib/fetchData";
import SearchBox from "@/components/SearchBox";

export default function Home({ kampus }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Head>
        <title>Sarjana - Informasi Kampus Indonesia</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Data Kampus Indonesia</h1>
      <SearchBox data={kampus} />
    </div>
  );
}

export async function getStaticProps() {
  const kampus = await fetchKampusData();
  return {
    props: { kampus },
    revalidate: 3600, // update setiap jam
  };
}
