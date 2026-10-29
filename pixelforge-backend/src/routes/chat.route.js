import { Router } from "express";
// import { assistantPrompt } from "../ai/prompts.ai.js";
import { assistant } from "../ai/assistant.ai.js";
// import {llm } from

const router = Router();

router.post("/", async (req, res) => {
  console.log("Chat route reached!", req.body);
  try {
    const { question, history = [] } = req.body;

    const answer = await assistant(question, history);

    res.json({ answer: answer.content });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Något gick fel med chatboten." });
  }

  // console.log("Received question", question);

  // const chain = assistantPrompt.pipe(llm); //backend tar emot frågan från frontend.

  // const answer = await chain.invoke({ //prompten kopplas ihop med språkmodellen.
  //   history,
  //   question,
  // });
  // console.log("ANSWER:", answer);

  // res.json({ answer: answer.content }); // frågan skickas till modellen som genererar ett svar.
});

export default router;
