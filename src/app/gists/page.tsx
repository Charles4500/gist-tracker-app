"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { Layout } from "@/layout/Layout";
import { GistList } from "../gists/all-gists/GistList";
import { useGists } from "@/contexts/GistContext";

const GistsListPage = () => {
  // const location = useRouter();
  const { gists, isLoading, searchGists } = useGists();

  const [searchQuery, setSearchQuery] = useState("");

  // Get search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams();
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, []);

  // Filter gists based on search query
  const filteredGists = searchQuery ? searchGists(searchQuery) : gists;

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <GistList
            gists={filteredGists}
            isLoading={isLoading}
            title={
              searchQuery
                ? `Search results for "${searchQuery}"`
                : "Explore Gists"
            }
            subtitle={
              searchQuery
                ? `${filteredGists.length} gists found`
                : "Discover code snippets from the community"
            }
            emptyMessage={
              searchQuery
                ? "No gists found matching your search"
                : "No gists available"
            }
          />
        </div>
      </section>
    </Layout>
  );
};

export default GistsListPage;
