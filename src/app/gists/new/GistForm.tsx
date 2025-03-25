"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { GistProvider, useGists } from "@/contexts/GistContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Gist } from "@/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GistFormProps {
  existingGist?: Gist;
  isEditing?: boolean;
}

// Language options for the select
const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
];

export const GistForm = ({
  existingGist,
  isEditing = false,
}: GistFormProps) => {
  const router = useRouter();
  const { createGist, updateGist, isLoading } = useGists();

  const [formData, setFormData] = useState({
    title: existingGist?.title || "",
    description: existingGist?.description || "",
    code: existingGist?.code || "",
    language: existingGist?.language || "javascript",
    isPublic: existingGist?.isPublic ?? true,
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }));
  };

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, language: value }));
  };

  const handleCancel = () => {
    router.back();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.code.trim()) {
      setError("Code snippet is required");
      return;
    }

    try {
      if (isEditing && existingGist) {
        await updateGist(existingGist.id, formData);
        router.push(`/gists/${existingGist.id}`);
      } else {
        const newGist = await createGist({
          ...formData,
          email: "",
          owner: {
            login: "",
            id: "",
            avatar_url: undefined,
          },
          created_at: new Date(),
          updated_at: new Date(),
        });
        if (newGist?.id) {
          router.push(`/gists/${newGist.id}`);
        }
      }
    } catch (err) {
      setError((err as Error).message || "Failed to save gist");
    }
  };

  return (
    <GistProvider>
      <Card className="w-full glass-card animate-scale-in">
        <CardHeader className="space-y-1">
          <Badge variant="outline" className="w-fit">
            {isEditing ? "Edit Gist" : "New Gist"}
          </Badge>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? "Edit your gist" : "Create a new gist"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your code snippet with the changes you want to make"
              : "Share your code snippet with the community"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Give your gist a descriptive title"
                value={formData.title}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add some context about your code"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-background/50 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={handleLanguageChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="language" className="bg-background/50">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <div className="flex items-center justify-between bg-background/50 p-3 rounded-md border">
                  <span className="text-sm">Make this gist public</span>
                  <Switch
                    id="visibility"
                    checked={formData.isPublic}
                    onCheckedChange={handleSwitchChange}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.isPublic
                    ? "Anyone can see this gist"
                    : "Only you can see this gist"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Textarea
                id="code"
                name="code"
                placeholder="Paste your code here"
                value={formData.code}
                onChange={handleChange}
                disabled={isLoading}
                className="font-mono text-sm bg-secondary/50 min-h-[200px] resize-y"
                rows={10}
                required
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">●</span>
                    {isEditing ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update gist" : "Create gist"}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </GistProvider>
  );
};
