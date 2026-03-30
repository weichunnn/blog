import { VoyageAIClient } from "voyageai";

const EMBEDDING_MODEL = "voyage-4-large";

const voyageClient = new VoyageAIClient({
  apiKey: process.env.VOYAGE_AI_API_KEY,
});

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

type InputType = "document" | "query";

async function embedWithRetry(
  input: string | string[],
  inputType: InputType
): Promise<number[][] | null> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await voyageClient.embed({
        model: EMBEDDING_MODEL,
        input,
        inputType,
      });

      const embeddings = result?.data?.map((d) => d.embedding ?? []) ?? [];
      if (embeddings.length === 0 || embeddings.some((e) => e.length === 0)) {
        return null;
      }
      return embeddings;
    } catch (error) {
      const isLast = attempt === MAX_RETRIES - 1;
      if (isLast) {
        console.error("Embedding failed after retries:", error);
        return null;
      }
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return null;
}

export async function getEmbeddingsBatch(
  texts: string[],
  inputType: InputType = "document"
): Promise<string[] | null> {
  if (texts.length === 0) return null;

  const embeddings = await embedWithRetry(texts, inputType);
  if (!embeddings) return null;

  return embeddings.map((e) => `[${e.join(",")}]`);
}

export async function getEmbeddingsRemote(
  text: string,
  inputType: InputType = "query"
): Promise<string | null> {
  if (!text) return null;

  const result = await getEmbeddingsBatch([text], inputType);
  return result?.[0] ?? null;
}
