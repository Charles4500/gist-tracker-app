import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Calendar,
  User,
  Globe,
  Lock,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Gist } from "@/types/models";
import { useGists } from "@/contexts/GistContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

interface GistDetailProps {
  gist: Gist;
}

export const GistDetail = ({ gist }: GistDetailProps) => {
  const router = useRouter();

  const { toggleStar, deleteGist } = useGists();
  const { data: session } = useSession();
  const [isStarring, setIsStarring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = session?.user?.name === gist.owner.login;

  const handleStar = async () => {
    if (!session) {
      router.push("/");
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gist.code);
    toast.success("Code copied to clipboard");
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteGist(gist.id);
      router.push("/my-gists");
    } catch (error) {
      console.error("Failed to delete gist:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format the dates
  const createdDate = new Date(gist.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updatedDate = new Date(gist.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
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
      colors[language] || "bg-gray-500/20 text-gray-700 dark:text-gray-300"
    );
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={`${getLanguageColor(gist.language)}`}
            >
              {gist.language}
            </Badge>
            <Badge variant="outline" className="bg-secondary/50">
              {gist.isPublic ? (
                <Globe className="mr-1 h-3 w-3" />
              ) : (
                <Lock className="mr-1 h-3 w-3" />
              )}
              {gist.isPublic ? "Public" : "Private"}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold">{gist.title}</h1>
          {gist.description && (
            <p className="text-muted-foreground mt-2 max-w-3xl">
              {gist.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>User {gist.owner.login}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created on {createdDate}</span>
            </div>
            {createdDate !== updatedDate && (
              <div className="flex items-center gap-1">
                <Edit2 className="h-4 w-4" />
                <span>Updated on {updatedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{gist.starCount} stars</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 self-start mt-2 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            className={`${
              gist.isStarred
                ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400 dark:hover:bg-yellow-900"
                : ""
            }`}
            onClick={handleStar}
            disabled={isStarring}
          >
            <Star
              className={`mr-1 h-4 w-4 ${
                gist.isStarred ? "fill-yellow-500" : ""
              } ${isStarring ? "animate-pulse" : ""}`}
            />
            {gist.isStarred ? "Starred" : "Star"}
          </Button>

          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy className="mr-1 h-4 w-4" />
            Copy code
          </Button>

          {isOwner && (
            <>
              <Button variant="outline" size="sm" onClick={() => {}}>
                <Edit2 className="mr-1 h-4 w-4" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="animate-scale-in">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this gist?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your gist and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${getLanguageColor(gist.language)} px-2 py-0`}
            >
              {gist.language}
            </Badge>
            {/* <span className="text-sm text-muted-foreground">
              {gist?.code.split("\n").length} lines
            </span> */}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={handleCopyCode}
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="ml-1 text-xs">Copy</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
              <Link href={`/gists/${gist.id}/raw`} target="_blank">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="sr-only">View raw</span>
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="code-editor text-sm p-4 rounded-none overflow-x-auto bg-secondary/50 max-h-[70vh] overflow-y-auto">
            <pre>{gist.code}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
