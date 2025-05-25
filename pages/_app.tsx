import type { AppProps } from "next/app";
import "../styles/globals.css";
import { useEffect } from "react";
import { getConfig } from "../lib/googleSheet";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    getConfig().then(config => {
      Object.entries(config).forEach(([key, value]) => {
        if (key.startsWith("warna-"))
          document.documentElement.style.setProperty(`--${key}`, value);
      });
    });
  }, []);
  return <Component {...pageProps} />;
}
export default MyApp;