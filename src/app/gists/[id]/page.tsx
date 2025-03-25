"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Layout } from "@/layout/Layout";
import { GistDetail } from "../all-gists/GistDetail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGists } from "@/contexts/GistContext";
import { Gist } from "@/types/models";

const GistDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const { getGistById } = useGists();
  const [gist, setGist] = useState<Gist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchGist = async () => {
      setIsLoading(true);
      try {
        const fetchedGist = await getGistById(id);
        if (fetchedGist) {
          setGist(fetchedGist);
        } else {
          setError("Gist not found");
        }
      } catch (err) {
        setError("Could not load gist");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGist();
  }, [id, getGistById]);

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-64 bg-muted rounded"></div>
              <div className="h-4 w-full max-w-2xl bg-muted rounded"></div>
              <div className="h-4 w-1/2 max-w-xl bg-muted rounded"></div>
              <div className="h-80 bg-muted rounded"></div>
            </div>
          ) : error ? (
            <div className="max-w-xl mx-auto">
              <Alert variant="destructive" className="animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="mt-6 text-center">
                <Link href="/gists">
                  <Button variant="outline" className="mx-auto">
                    Return to gists
                  </Button>
                </Link>
              </div>
            </div>
          ) : gist ? (
            <GistDetail gist={gist} />
          ) : null}
        </div>
      </section>
    </Layout>
  );
};

export default GistDetailPage;
