import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Toaster } from "react-hot-toast";
import { NextAuthProvider } from "./provider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import NextTopLoader from "nextjs-toploader";
config.autoAddCss = false; /* eslint-disable import/first */

export const metadata = {
  title: "Kedai Mie Ayam",
  description: "Temukan Mie Ayam Seleramu!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="preload" href="/spinner.gif" as="image" />
        <link rel="preload" href="/404.svg" as="image" />
        <link rel="preload" href="/default_pfp.png" as="image" />
      </head>
      <body>
        <NextAuthProvider>
          <Toaster position="top-center" />
          <Header />
          <NextTopLoader showSpinner={false} color="#dc2626" />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
