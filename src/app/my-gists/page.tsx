"use client";

import { GistList } from "../../app/gists/all-gists/GistList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Layout } from "@/layout/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const GITHUB_ACCESS_TOKEN = " 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";

const MyGistsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [myGists, setMyGists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ONLY the logged-in user's gists
  useEffect(() => {
    if (!session?.user?.name) return;

    const fetchMyGists = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.github.com/users/${session.user.name}/gists`,
          {
            headers: {
              // Include auth token if needed (for private gists)
              Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
            },
          }
        );
        const gists = await response.json();
        setMyGists(gists);
      } catch (error) {
        console.error("Failed to fetch gists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyGists();
  }, [session?.user?.name]);
  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <GistList
              gists={myGists}
              isLoading={isLoading}
              title="My Gists"
              subtitle="Manage your personal code snippets"
              emptyMessage="You haven't created any gists yet"
            />

            {myGists.length === 0 && !isLoading && (
              <div className="w-full mt-8 flex justify-center">
                <Button
                  onClick={() => router.push("/create-gist")}
                  className="hover-lift"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create your first gist
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyGistsPage;
