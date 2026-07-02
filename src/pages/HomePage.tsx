import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import { Omra, Hotels, Visas, Billets, WhyUs, Reviews, Contact } from "../components/Sections";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    el?.scrollIntoView({ behavior: "smooth" });
  }, [location]);

  return (
    <>
      <Hero />
      <Omra />
      <Hotels />
      <Visas />
      <Billets />
      <WhyUs />
      <Reviews />
      <Contact />
    </>
  );
}
