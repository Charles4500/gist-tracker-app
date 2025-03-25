"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, RefreshCw, X } from "lucide-react";
import { Gist } from "@/types/models";
import { GistCard } from "./GistCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface GistListProps {
  gists: Gist[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}

export const GistList = ({
  gists,
  isLoading = false,
  title = "Gists",
  subtitle = "Browse code snippets",
  emptyMessage = "No gists found",
}: GistListProps) => {
  const [filteredGists, setFilteredGists] = useState<Gist[]>(gists);
  console.log("This are my gists", gists);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "stars">("newest");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  // Extract unique languages from gists
  const languages = Array.from(new Set(gists.map((gist) => gist.language)));

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let result = [...gists];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (gist) =>
          gist.title.toLowerCase().includes(query) ||
          (gist.description &&
            gist.description.toLowerCase().includes(query)) ||
          gist.language.toLowerCase().includes(query)
      );
    }

    // Apply language filter
    if (filterLanguage !== "all") {
      result = result.filter((gist) => gist.language === filterLanguage);
    }

    // Apply sorting
    result = result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortBy === "stars") {
        return (b.starCount || 0) - (a.starCount || 0);
      }
      return 0;
    });

    setFilteredGists(result);
  }, [gists, searchQuery, sortBy, filterLanguage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setFilterLanguage("all");
  };

  // Check if filters are applied
  const hasActiveFilters =
    searchQuery || sortBy !== "newest" || filterLanguage !== "all";

  return (
    <div className="space-y-6 w-full animate-fade-up">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search gists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 w-full"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={sortBy}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onValueChange={(value) => setSortBy(value as any)}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="stars">Most stars</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={hasActiveFilters ? "text-primary" : ""}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filter options</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Options</h4>

                <div className="space-y-2">
                  <Label htmlFor="language-filter">Language</Label>
                  <Select
                    value={filterLanguage}
                    onValueChange={setFilterLanguage}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All languages</SelectItem>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={resetFilters}
                  >
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Reset filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-muted bg-muted/50 p-4 h-52"
            >
              <div className="h-4 w-16 bg-muted rounded mb-2"></div>
              <div className="h-5 w-2/3 bg-muted rounded mb-4"></div>
              <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-20 bg-muted rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-muted rounded"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredGists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredGists.map((gist) => (
            <GistCard key={gist.id} gist={gist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-md bg-muted/20">
          <p className="text-muted-foreground">{emptyMessage}</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={resetFilters} className="mt-2">
              <RefreshCw className="mr-2 h-3 w-3" />
              Reset filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
