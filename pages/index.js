import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

const SHEET_ID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const API_KEY = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";
const SHEET_NAME = "DataKampus"; // Ganti dengan nama tab sebenarnya di Spreadsheet

const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((json) => {
        const [headers, ...rows] = json.values;
        const structuredData = rows.map((row) => {
          const entry = {};
          headers.forEach((header, i) => {
            entry[header] = row[i] || "";
          });
          return entry;
        });
        setData(structuredData);
        setFilteredData(structuredData);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredData(
      data.filter((item) =>
        Object.values(item).some((val) =>
          val.toLowerCase().includes(term)
        )
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Head>
        <title>Sarjana Web</title>
        <meta name="description" content="Informasi Data Kampus Indonesia" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-green-700 text-white p-4 shadow">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Sarjana.web.id</h1>
          <p className="text-sm">Pusat Informasi Kampus Indonesia</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Cari nama kampus, lokasi, website..."
          className="w-full p-2 border border-gray-300 rounded-lg mb-6"
        />

        {filteredData.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada data ditemukan.</p>
        ) : (
          <div className="grid gap-4">
            {filteredData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-green-700">
                  {item.Nama || "-"}
                </h2>
                <p className="text-sm mt-1 text-gray-600">
                  <strong>Alamat:</strong> {item.Alamat || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Website:</strong>{" "}
                  <a
                    href={item.Website || "#"}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.Website || "-"}
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Akreditasi:</strong> {item.Akreditasi || "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white shadow p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sarjana.web.id — Semua Hak Dilindungi
      </footer>
    </div>
  );
}
