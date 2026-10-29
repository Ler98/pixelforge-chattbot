import { Outlet } from "react-router-dom";
import { Header } from "@pixelforge/header";
import { Footer } from "@pixelforge/footer";
import "./index.css";
import Chatbot from "../../../shared/chat/Chatbot";

export const Layout = () => {
  return (
    <>
      <Header />
      <main className="page">
        <Outlet />
        <section className="chatbot__section">
          <Chatbot />
        </section>
      </main>

      <Footer />
    </>
  );
};
