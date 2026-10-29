import { embeddingModel } from "../config/ollama.config.js";
import { supabase } from "../config/supabase.config.js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

export const retrieveDocuments = async (question) => {
  const vectorStore = new SupabaseVectorStore(embeddingModel, {
    client: supabase, // Använder anslutningen till Supabase.
    tableName: "documents", // Tabellen där dokumenten är sparade.
    queryName: "match_documents", // Funktionen som söker bland dokumenten.
  });

  // Söker efter de 3 textbitar som bäst matchar frågan.
  const results = await vectorStore.similaritySearch(question, 3);

  // Hämtar textinnehållet från sökresultaten.
  // Slår ihop textbitarna till en enda text med tom rad mellan varje bit.
  return results.map((doc) => ({
    content: doc.pageContent,
    source: doc.metadata.source,
  }));
};

// Jag använder LangChains SupabaseVectorStore för att söka efter relevanta dokument i Supabase.
//det verkade smidigt eftersom LangChains används i projektet.
