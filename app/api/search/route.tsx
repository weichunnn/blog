import { NextRequest, NextResponse } from "next/server";
import { Client } from "@neondatabase/serverless";
import { getEmbeddingsRemote } from "@/scripts/embeddings";

export interface SearchResult {
  id: string;
  content: string;
  slug: string;
  title: string;
  similarity: number;
}

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");
    const matchThreshold = Number(searchParams.get("matchThreshold")) || 0.5;
    const matchCount = Number(searchParams.get("matchCount")) || 10;

    if (!query) {
      return new Response("Missing query parameter", { status: 400 });
    }

    const embedding = await getEmbeddingsRemote(query, "query");

    const databaseClient = new Client(process.env.DATABASE_URL);
    await databaseClient.connect();

    const { rows }: { rows: SearchResult[] } = await databaseClient.query(
      `SELECT * FROM match_documents($1::vector, $2, $3)`,
      [embedding, matchThreshold, matchCount]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching search results:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
