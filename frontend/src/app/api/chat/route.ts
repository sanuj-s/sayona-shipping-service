import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      messages,
      system: `You are an intelligent logistics and freight parsing assistant for Sayona Shipping Services. 
You extract structured data from unstructured cargo manifests and answer logistics-related inquiries.
Always maintain a professional, luxury-enterprise tone. Keep responses concise and focused on shipping operations.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
