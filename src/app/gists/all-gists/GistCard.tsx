"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ExternalLink, Calendar, UserCircle } from "lucide-react";
import { Gist } from "@/types/models";
import { useGists } from "@/contexts/GistContext";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GistCardProps {
  gist: Gist;
}

export const GistCard = ({ gist }: GistCardProps) => {
  const { toggleStar } = useGists();
  const { data: session } = useSession();
  const [isStarring, setIsStarring] = useState(false);

  const handleStar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = "/";
      return;
    }

    if (isStarring) return;

    setIsStarring(true);
    try {
      await toggleStar(gist.id);
    } finally {
      setIsStarring(false);
    }
  };

  // Format the created date
  const formattedDate = new Date(gist.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Get language badge color
  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
      typescript: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      python: "bg-green-500/20 text-green-700 dark:text-green-300",
      java: "bg-red-500/20 text-red-700 dark:text-red-300",
      go: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
      rust: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
      html: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
      css: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    };

    return (
      colors[language?.toLowerCase()] ||
      "bg-gray-500/20 text-gray-700 dark:text-gray-300"
    );
  };

  // Get code preview
  const codePreview =
    gist.code?.split("\n").slice(0, 3).join("\n") || "No code available";
  return (
    <Link href={`/gists/${gist.id}`}>
      <Card className="h-full hover-lift hover:border-primary/20 transition-all duration-300 glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <div>
              <Badge
                variant="outline"
                className={`mb-2 ${getLanguageColor(gist?.language)}`}
              >
                {gist?.language}
              </Badge>
              <h3 className="text-lg font-semibold line-clamp-1">
                {gist.title}
              </h3>
              {gist.description && (
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                  {gist.description}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full h-8 w-8 ${
                gist.isStarred
                  ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={handleStar}
              disabled={isStarring}
            >
              <Star
                className={`h-4 w-4 ${
                  gist.isStarred ? "fill-yellow-500" : ""
                } ${isStarring ? "animate-pulse" : ""}`}
              />
              <span className="sr-only">
                {gist.isStarred ? "Unstar" : "Star"} this gist
              </span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="code-editor text-xs line-clamp-3 h-16 overflow-hidden">
            <pre>{codePreview}</pre>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-0">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <UserCircle className="h-3 w-3" />
              <span>User {gist.owner.login}</span>
            </div>

            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{gist.starCount}</span>
            </div>

            <ExternalLink className="h-3 w-3 ml-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
