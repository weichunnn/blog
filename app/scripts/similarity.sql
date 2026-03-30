-- Vector similarity search function (uses HNSW index via <=> operator)
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1024),
  match_threshold float,
  match_count int
) RETURNS TABLE (
  id uuid,
  content text,
  slug text,
  title text,
  similarity float
) LANGUAGE sql STABLE AS $$
  SELECT
    documents.id,
    documents.content,
    documents.slug,
    documents.title,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM
    documents
  WHERE
    1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY
    documents.embedding <=> query_embedding
  LIMIT
    match_count;
$$;

-- HNSW index for fast approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON "public"."documents"
  USING hnsw (embedding vector_cosine_ops);
