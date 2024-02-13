import * as React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Toaster } from "react-hot-toast";

const PageLayout = ({ children }) => {
  return (
    <main>
      <Toaster position="top-center" />
      <Header />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </main>
  );
};

export default PageLayout;
