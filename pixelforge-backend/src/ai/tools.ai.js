import { products } from "../../../pixelforge-frontend/packages/core/data/products/data/index.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { retrieveDocuments } from "./retriever.ai.js";

const searchProduct = tool(
  async ({ query }) => {
    //query innehåller söktexten som AI:n skickar till den här funktionen.
    const searchText = query.toLowerCase(); //gör sökningen till små bokstäver

    const synonyms = {
      //ord som motsvarar ord för att hjälpa chattboten som inte kan översätta så bra.
      tangentbord: ["tangentbord", "keyboard"],
      hörlurar: ["hörlurar", "headset", "headphones"],
      skärm: ["skärm", "monitor"],
      mus: ["mus", "mouse"],
    };

    const ignoredWords = [
      //ord om chattboten ska strunta i för att fokusera på sökningen
      // pris
      "pris",
      "priset",
      "priser",
      "kostar",
      "kosta",
      "kostnad",
      "kr",
      "kronor",
      "sek",
      "price",
      "cost",
      "billig",
      "billigt",
      "billiga",
      "billigaste",
      "dyr",
      "dyrt",
      "dyra",
      "dyraste",
      "rea",
      "rabatt",
      "erbjudande",
      "sparar",
      "spara",

      // lager
      "lager",
      "lagret",
      "lagerstatus",
      "finns",
      "kvar",
      "tillgänglig",
      "tillgängliga",
      "tillgängligt",
      "stock",
      "slut",
      "köpa",

      // kategori, urval och betyg
      "kategori",
      "kategorin",
      "typ",
      "sorts",
      "modell",
      "modeller",
      "produkt",
      "produkter",
      "alla",
      "några",
      "något",
      "visa",
      "vilka",
      "vilken",
      "vilket",
      "som",
      "bästa",
      "bäst",
      "betyg",
      "betyget",
      "recensioner",
      "populära",
      "populäraste",

      // vanliga frågeord
      "vad",
      "hur",
      "mycket",
      "många",
      "är",
      "det",
      "den",
      "de",
      "har",
      "ni",
      "ett",
      "en",
      "jag",
      "söker",
      "letar",
      "efter",
      "vill",
      "kan",
      "får",
      "på",
      "för",
      "med",
      "av",
      "om",
      "till",
    ];

    const searchWords = searchText //hittar rätt ord på nått vis?
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length > 1 && !ignoredWords.includes(word));

    const results = products.filter((product) => {
      //hitta produkter från söktexten.
      const productText = JSON.stringify(product)
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " "); //konstiga tecken

      return searchWords.every((word) => {
        const alternatives = synonyms[word] || [word]; //jämför något

        return alternatives.some((term) => productText.includes(term)); // returnerar alternativ som matchar frågan från användaren
      });
    });

    // const searchText = query.toLowerCase();

    //hitta produkter vars namn innehåller söktexten.
    // const results = products.filter((product) =>
    //   product.name.toLowerCase().includes(searchText),
    // );

    //SKicka tillbaka de produkter som hittades.
    console.log("PRODUKTSÖKNING:", results);
    return JSON.stringify(results);
  },
  {
    name: "search_products", //inställningar som beskriver verktyget.
    description: "söker efter produkter i butiken",
    schema: z.object({
      query: z.string(),
    }),
  },
);

const search_support_docs = tool(
  async ({ query }) => {
    const retuls = await retrieveDocuments(query);

    console.log("RESULTAT FRÅN SUPPORTDOKUMENT:", retuls);
    return JSON.stringify(retuls);
    // Skapar en koppling till dokumenten som finns i Supabase.
    // embeddingModel omvandlar sökfrågan till siffror (embeddings).
  },
  {
    name: "search_support_docs", //inställningar som beskriver verktyget.
    description: "söker efter relevant text i dina PDF-dokument via Supabase",
    schema: z.object({
      query: z.string(), // Verktyget förväntar sig en sökfråga i textformat.
    }),
  },
);

export const tools = [searchProduct, search_support_docs];
