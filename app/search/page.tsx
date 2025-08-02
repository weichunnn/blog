"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/shared/ui/input";
import { Card, CardContent } from "@/components/shared/ui/card";
import Link from "next/link";
import Header from "@/components/Header";
import ReactMarkdown from "react-markdown";
import { SearchResult } from "@/api/search/route";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (query) {
        searchAPI(query);
      } else {
        setResults([]);
      }
    }
  };

  const searchAPI = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Search results:", data);
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const truncateContent = (content: string, maxLength: number) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "…"
      : content;
  };

  return (
    <>
      <Header title="Search Semantically" className="mb-4" />
      <Input
        type="text"
        placeholder="What's the best day of my life?"
        value={query}
        onChange={handleInputChange}
        className="mb-4"
        onKeyDown={handleKeyPress}
      />
      {isLoading && <p className="text-center">Loading...</p>}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <Card
              key={result.id}
              className="p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-0">
                <Link
                  href={`/blog/${result.slug}`}
                  className="block no-underline group"
                >
                  <article className="transition-colors">
                    <h3 className="text-md font-semibold group-hover:text-primary">
                      {result.title}
                    </h3>
                    <div className="text-muted-foreground mt-2">
                      <ReactMarkdown>
                        {truncateContent(result.content, 150)}
                      </ReactMarkdown>
                    </div>
                  </article>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {query && !isLoading && results.length === 0 && (
        <p className="text-center">No results found.</p>
      )}
    </>
  );
}
