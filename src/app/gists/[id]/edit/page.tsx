"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Gist } from "@/types/models";
import { getGistById, updateGist } from "@/app/api/gists/gists";

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "Python",
  "Ruby",
  "Java",
  "C#",
  "PHP",
  "Go",
  "Rust",
  "SQL",
];

export default function EditGistPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gist, setGist] = useState<Gist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  useEffect(() => {
    const fetchGist = async () => {
      try {
        const gistData = await getGistById(id);
        if (!gistData) {
          setError("Gist not found");
        } else {
          setGist(gistData);
        }
      } catch (err) {
        setError("Failed to load gist");
        console.error("Error fetching gist:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGist();
  }, [id]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!gist) return;

    const formData = new FormData(event.currentTarget);
    const updatedGist = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      language: formData.get("language") as string,
      content: formData.get("content") as string,
    };

    try {
      await updateGist(id, updatedGist);
      toast.success("Gist updated successfully");
      router.push(`/gists/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update gist");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold">Loading gist...</h2>
      </div>
    );
  }

  if (error || !gist) {
    return (
      <div className="container max-w-5xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold">{error || "Gist not found"}</h2>
        <p className="text-muted-foreground mb-6">
          {
            "The gist you're trying to edit doesn't exist or you don't have permission to access it."
          }
        </p>
        <Button asChild>
          <Link href="/gists">Back to Gists</Link>
        </Button>
      </div>
    );
  }

  // Check if current user is the owner of the gist
  if (session?.user?.id !== gist.id) {
    return (
      <div className="container max-w-5xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold">Unauthorized</h2>
        <p className="text-muted-foreground mb-6">
          {" You don't have permission to edit this gist."}
        </p>
        <Button asChild>
          <Link href="/gists">Back to Gists</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Gist</h1>

      <Card>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Edit Gist Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={gist.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={gist.description || ""}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select name="language" defaultValue={gist.language}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                // defaultValue={gist.content}
                className="font-mono"
                rows={15}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
