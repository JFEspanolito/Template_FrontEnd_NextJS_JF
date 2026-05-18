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

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        max_tokens: max,
        temperature: temp,
        user: userId,
      }),
    });

    if (!res.ok) {
      console.error("GPT Error:", res.status, res.statusText);
      return null;
    }

    const data: OpenAiResponse = await res.json();
    return data.choices[0].message.content;
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error("GPT Error:", err.message || String(e));
    return null;
  }
};
