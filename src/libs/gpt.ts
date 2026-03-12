import axios from "axios";
import configApi from "@/data/configApi";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAiResponse {
  choices: Array<{
    message: { content: string };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const sendOpenAi = async (
  messages: Message[],
  userId: string,
  max: number = 100,
  temp: number = 1
): Promise<string | null> => {
  const apiKey = configApi.ai.openai;
  if (!apiKey) {
    console.error("GPT Error: OPENAI_API_KEY is not set");
    return null;
  }

  const url = "https://api.openai.com/v1/chat/completions";

  const body = JSON.stringify({
    model: "gpt-4",
    messages,
    max_tokens: max,
    temperature: temp,
    user: userId,
  });

  const options = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post<OpenAiResponse>(url, body, options);
    return res.data.choices[0].message.content;
  } catch (e: unknown) {
    const err = e as { response?: { status?: number }; message?: string };
    console.error("GPT Error:", err.response?.status, err.message || String(e));
    return null;
  }
};
