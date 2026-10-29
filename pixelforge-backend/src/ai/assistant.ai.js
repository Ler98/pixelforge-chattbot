import { tools } from "./tools.ai.js";
import { llm } from "../config/ollama.config.js";
import { ToolMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import { assistantPrompt } from "./prompts.ai.js";
import { products } from "../../../pixelforge-frontend/packages/core/data/products/data/index.js";

export const assistant = async (question, history = []) => {
  //fungerar även om det inte finns någon historik.

  // Gör om historiken till meddelanden som LangChain förstår.
  const chatHistory = history.map((msg) =>
    msg.role === "human"
      ? new HumanMessage(msg.content)
      : new AIMessage(msg.content),
  );

  // Skapar meddelandelistan med instruktioner, historik och ny fråga.
  // const messages = await assistantPrompt.formatMessages({
  //   question,
  //   history: chatHistory,
  // });
  // Hitta en produkt som nämns i frågan.

  //ny kod under
  const questionLower = question.toLowerCase();

  const productInQuestion = products.find((product) =>
    questionLower.includes(product.name.toLowerCase()),
  );

  // Se om frågan gäller en produktegenskap.
  const asksAboutProduct =
    /pris|kostar|lager|lagret|lagerstatus|betyg|recension|kategori|produkt|hur många|finns kvar/i.test(
      question,
    );

  // Om användaren skriver "den" kan vi behöva använda historiken.
  const historyText = history
    .map((message) => message.content)
    .join(" ")
    .toLowerCase();

  const productInHistory = products.find((product) =>
    historyText.includes(product.name.toLowerCase()),
  );

  const productToSearch =
    productInQuestion || (asksAboutProduct ? productInHistory : null);

  // Hämta produktdata innan AI:n svarar.
  let questionWithProductData = question;

  if (productToSearch) {
    const productTool = tools.find((tool) => tool.name === "search_products");

    const productData = await productTool.invoke({
      query: productToSearch.name,
    });

    questionWithProductData = `
    Användarens fråga: ${question}

    Produktdata från produktsökningen:
    ${productData}

    Svara utifrån produktdatan.
    Hitta inte på eller ändra några uppgifter.
  `;
  }

  // Kolla om frågan handlar om support.
  const supportKeywords =
    /retur|returner|ånger|ångra|leverans|frakt|reklamation|reklamera|garanti|support|kontakt|beställning|order/i;

  let questionWithSupportData = questionWithProductData;

  if (supportKeywords.test(question)) {
    const supportTool = tools.find(
      (tool) => tool.name === "search_support_docs",
    );

    console.log("SÖKER I SUPPORTDOKUMENT:", question);

    const supportData = await supportTool.invoke({
      query: question,
    });

    console.log("RESULTAT FRÅN SUPPORTDOKUMENT:", supportData);
    const parsedSupportData =
      typeof supportData === "string" ? JSON.parse(supportData) : supportData;

    const supportSources = parsedSupportData.map((doc) => doc.source);
    console.log("UNIKA SUPPORTDOKUMENT:", [...new Set(supportSources)]);
    const supportLinks = [...new Set(supportSources)].map((source) => {
      const slug = source.replace(/^doc-\d+_/, "").replace(/\.pdf$/, "");

      return {
        title: slug.replace(/-/g, " "),
        url: `/support/${slug}`,
      };
    });

    // const supportSources = parsedSupportData.map((doc) => doc.source);
    console.log("SUPPORTKÄLLOR:", supportSources);
    console.log("TYP AV SUPPORTDATA:", typeof supportData);
    console.log("PARSED SUPPORTDATA:", parsedSupportData);
    console.log("ÄR ARRAY:", Array.isArray(parsedSupportData));

    questionWithSupportData = `
      ${questionWithProductData}

      Information från supportdokumenten:
      ${
        typeof supportData === "string"
          ? supportData
          : JSON.stringify(supportData, null, 2)
      }

      Svara utifrån informationen från supportdokumenten.
      Hitta inte på regler, länkar eller villkor som saknas i informationen.
    `;
  }

  const messages = await assistantPrompt.formatMessages({
    question: questionWithSupportData,
    history: chatHistory,
  });

  //ny kod ovan

  const llmWithTools = llm.bindTools(tools);
  const response = await llmWithTools.invoke(messages);
  console.log("MODELLENS FÖRSTA SVAR:", response);

  if (!response.tool_calls?.length) {
    return response;
  }

  const toolMessages = [];

  for (const toolCall of response.tool_calls) {
    const selectedTool = tools.find((tool) => tool.name === toolCall.name);

    if (!selectedTool) {
      throw new Error(`Unknown tool: ${toolCall.name}`);
    }

    console.log("VERKTYG ANROPAS:", toolCall.name, toolCall.args);

    const result = await selectedTool.invoke(toolCall.args);

    console.log("VERKTYG RESULTAT:", result);

    toolMessages.push(
      new ToolMessage({
        content: String(result), //svaret till text
        tool_call_id: toolCall.id,
      }),
    );
  }

  return await llmWithTools.invoke([...messages, response, ...toolMessages]);
};
