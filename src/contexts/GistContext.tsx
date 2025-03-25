"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import { Gist } from "@/types/models";
import { useSession } from "next-auth/react";

const GITHUB_API_URL = "https://api.github.com/gists";
const GITHUB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// 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
// 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
interface GistContextType {
  gists: Gist[];
  isLoading: boolean;
  createGist: (
    gistData: Omit<Gist, "id" | "userId" | "starCount">
  ) => Promise<Gist>;
  updateGist: (id: string, gistData: Partial<Gist>) => Promise<Gist>;
  deleteGist: (id: string) => Promise<void>;
  getGistById: (id: string) => Promise<Gist | undefined>;
  searchGists: (query: string) => Gist[];
  toggleStar: (id: string) => Promise<void>;
}

const GistContext = createContext<GistContextType | undefined>(undefined);

export const GistProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [gists, setGists] = useState<Gist[]>([]);
  console.log(gists);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load gists on mount and when user changes
  useEffect(() => {
    const fetchGists = async () => {
      if (!session) return; // Ensure user is logged in

      setIsLoading(true);
      try {
        const response = await fetch(`${GITHUB_API_URL}/public`, {
          headers: {
            Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        console.log(response);
        if (!response.ok) throw new Error("Failed to fetch gists");

        const data = await response.json();
        console.log("Raw response JSON:", data);
        setGists(data); // Set gists from API response
      } catch (error) {
        console.error("Failed to fetch gists:", error);
        toast.error("Failed to load gists");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGists();
  }, [session]);

  const createGist = async (
    gistData: Omit<
      Gist,
      "id" | "userId" | "createdAt" | "updatedAt" | "starCount"
    >
  ): Promise<Gist> => {
    if (!session) throw new Error("User must be logged in to create a gist");

    setIsLoading(true);
    try {
      const filename = gistData.title.includes(".")
        ? gistData.title
        : `${gistData.title}.${gistData.language}`; // Ensure a valid filename

      const response = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: gistData.description,
          public: gistData.isPublic,
          files: {
            [filename]: {
              content: gistData.code,
            },
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Unauthorized: Invalid API token");
        throw new Error(`Failed to create gist: ${response.statusText}`);
      }

      const newGistData = await response.json();

      // 🟢 Map GitHub API response to match your `Gist` type
      const newGist: Gist = {
        id: newGistData.id,
        title: filename,
        description: gistData.description,
        code: gistData.code,
        language: gistData.language,
        isPublic: gistData.isPublic,
        email: session.user.email, // Assuming `session.user.email` exists

        owner: {
          login: newGistData.owner?.login || "",
          id: newGistData.owner?.id || "",
          avatar_url: newGistData.owner?.avatar_url,
        },
        created_at: newGistData.created_at,
        updated_at: newGistData.updated_at,
        starCount: 0, // GitHub API does not return stars in the gist creation response
      };

      setGists((prev) => [newGist, ...prev]); // Update local state
      toast.success("Gist created successfully");
      return newGist;
    } catch (error) {
      console.error("Failed to create gist:", error);
      toast.error("Failed to create gist: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGist = async (
    id: string,
    gistData: Partial<Gist>
  ): Promise<Gist> => {
    if (!session) throw new Error("User must be logged in to update a gist");

    setIsLoading(true);
    try {
      const response = await fetch(`${GITHUB_API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: gistData.description,
          files: {
            [gistData.title || "Untitled"]: {
              content: gistData.code,
            },
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update gist");

      const updatedGist = await response.json();
      setGists((prev) =>
        prev.map((gist) => (gist.id === id ? updatedGist : gist))
      ); // Update gist in state
      toast.success("Gist updated successfully");
      return updatedGist;
    } catch (error) {
      console.error("Failed to update gist:", error);
      toast.error("Failed to update gist: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGist = async (id: string): Promise<void> => {
    if (!session) throw new Error("User must be logged in to delete a gist");

    setIsLoading(true);
    try {
      const response = await fetch(`${GITHUB_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete gist");

      setGists((prev) => prev.filter((gist) => gist.id !== id)); // Remove gist from state
      toast.success("Gist deleted successfully");
    } catch (error) {
      console.error("Failed to delete gist:", error);
      toast.error("Failed to delete gist: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getGistById = useCallback(
    async (id: string): Promise<Gist | undefined> => {
      setIsLoading(true);
      try {
        const response = await fetch(`${GITHUB_API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch gist: ${response.status}`);
        }

        const data = await response.json();

        // Transform to your Gist type
        const transformedGist: Gist = {
          id: data.id,
          title: data.description || "Untitled Gist",
          description: data.description || "",
          language: data.language,
          isPublic: data.public,
          email: data.owner?.email || "",
          owner: {
            id: data.owner.id.toString(),
            login: data.owner.login,
            avatar_url: data.owner.avatar_url,
          },
          created_at: data.created_at,
          updated_at: data.updated_at,
          public: data.public,
          comments: data.comments,
          starCount: 0,
          code: "",
        };

        return transformedGist;
      } catch (error) {
        console.error("Error fetching gist:", error);
        toast.error("Failed to fetch gist");
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  const searchGists = (query: string): Gist[] => {
    if (!query.trim()) return gists;

    const lowerQuery = query.toLowerCase();
    return gists.filter(
      (gist) =>
        gist.title.toLowerCase().includes(lowerQuery) ||
        (gist.description &&
          gist.description.toLowerCase().includes(lowerQuery)) ||
        gist.code.toLowerCase().includes(lowerQuery)
    );
  };

  const toggleStar = async (id: string): Promise<void> => {
    if (!session) throw new Error("User must be logged in to star a gist");

    try {
      const gist = gists.find((g) => g.id === id);
      if (!gist) throw new Error("Gist not found");

      const isStarred = !gist.isStarred;
      const response = await fetch(`${GITHUB_API_URL}/${id}/star`, {
        method: isStarred ? "PUT" : "DELETE",
        headers: {
          Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) throw new Error("Failed to toggle star");

      // setGists((prev) =>
      //   prev.map((gist) =>
      //     gist.id === id
      //       ? {
      //           ...gist,
      //           isStarred,
      //           starCount: isStarred ? starCount + 1 : gist.starCount - 1,
      //         }
      //       : gist
      //   ) // Update star status in state
    } catch (error) {
      console.error("Failed to toggle star:", error);
      toast.error("Failed to update star status");
    }
  };

  return (
    <GistContext.Provider
      value={{
        gists,
        isLoading,
        createGist,
        updateGist,
        deleteGist,
        getGistById,
        searchGists,
        toggleStar,
      }}
    >
      {children}
    </GistContext.Provider>
  );
};

export const useGists = () => {
  const context = useContext(GistContext);
  console.log(context);
  if (context === undefined) {
    throw new Error("useGists must be used within a GistProvider");
  }
  return context;
};
