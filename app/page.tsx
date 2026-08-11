import { supabase } from "@/lib/supabase";

import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import LiveStats from "@/components/home/LiveStats";
import TrendingEvents from "@/components/home/TrendingEvents";
import Categories from "@/components/home/Categories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Cities from "@/components/home/Cities";
import Footer from "@/components/home/Footer";

import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
  }>;
}) {
  const params = await searchParams;

  const search = params.search?.trim().toLowerCase() || "";

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.log(error);
  }

  const filteredEvents = (events || []).filter((event) => {
    if (!search) return true;

    const searchableText = [
      event.title,
      event.category,
      event.venue,
      event.city,
      event.country,
      event.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search);
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-100">

      <Navbar />

      <Hero />

      <LiveStats
        events={events || []}
      />

      <TrendingEvents
        events={filteredEvents}
      />

      <Categories />

      <WhyChooseUs />

      <Cities />

      <Footer />

    </main>
  );
}