import { useState } from "react";
import { PromptMapping, prompts } from "../../prompts/static-prompts";
import uuid4 from "uuid4";

const EDGE_API_PATH = "/api/remote-database/conversation";
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  mapsTo?: PromptMapping;
};

type Payload = {
  patient: {
    id: string;
    email: string;
    location: null | { latitude: number; longitude: number };
  };
  conversation: { id: string; answers: Answers };
};

type Answers = {
  answers: {
    [K in PromptMapping]: string;
  };
};

const edgePost = async (payload: { payload: Payload }) => {
  console.log(payload);
  const body = JSON.stringify(payload);

  // Edge API forwards requests after appending remote database API key
  try {
    const response = await fetch(EDGE_API_PATH, {
      body,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
  } catch (e) {
    console.error(e);
  }
};

const reduceChatHistoryToAnswers = (chatHistory: ChatMessage[]) =>
  chatHistory.reduce(
    (acc, { role, content, mapsTo: field }) => {
      if (role === "user" && field) {
        acc.answers[field] = content;
      }
      return acc;
    },
    { answers: {} } as Answers
  );

/**
 * A custom hook to handle the chat state and logic
 * Builds a payload after the final prompt
 */
export function useChat() {
  const [chat, setChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>();
  const getNextPrompt = () => {
    const prompt = prompts[currentPromptIndex + 1];
    setCurrentPromptIndex((prev) => prev + 1);
    return prompt;
  };

  const sendMessage = (message: string) => {
    const currentMapsTo = prompts[currentPromptIndex]?.mapsTo;
    const nextPrompt = getNextPrompt();

    setChatHistory((curr) => {
      const newHistory = [
        ...curr,
        {
          role: "user",
          content: message,
          mapsTo: currentMapsTo,
        } as ChatMessage,
      ];

      if (!nextPrompt) {
        newHistory.push({
          role: "assistant",
          content: "Data is being sent to the backend",
        });

        const conversation = {
          id: localStorage.getItem("conversationId") || uuid4(),
          answers: reduceChatHistoryToAnswers(chatHistory),
        };

        console.log({ conversation });
        const payload: Payload = {
          conversation,
          patient: {
            id: localStorage.getItem("userId") || uuid4(),
            email: "abc@def.com",
            location: {
              latitude: Number(localStorage.getItem("location.latitude")),
              longitude: Number(localStorage.getItem("location.longitude")),
            },
          },
        };
        setCompleted(true);
        edgePost({ payload });
      } else {
        newHistory.push({
          role: "assistant",
          content: nextPrompt.question,
        });
      }

      return newHistory;
    });

    setChat(null);
  };

  return {
    sendMessage,
    chat,
    chatHistory,
    completed,
  };
}
