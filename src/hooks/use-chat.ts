import { Recomendations, Result } from "../types/recommendations.types";
import { useEffect, useState } from "react";
import { PromptMapping, prompts } from "../../prompts/static-prompts";
import uuid4 from "uuid4";

const API_PATH =
  "https://gpt-snack-dandies-lzfxylzina-uc.a.run.app/doctor-category";
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

const apiPost = async (payload: { payload: Payload }) => {
  console.log(payload);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(
    "Access-Control-Allow-Origin",
    "https://main--melodic-creponne-ae0f94.netlify.app/"
  );
  const response = await fetch(API_PATH, {
    body: JSON.stringify(payload),
    method: "POST",
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  console.log({ data });
  debugger;
  return data;
};

const reduceChatHistoryToAnswers = (chatHistory: ChatMessage[]) =>
  chatHistory.reduce(
    (acc, { role, content, mapsTo: field }) => {
      if (role === "user" && field) {
        acc.answers[field] = content as string;
      }
      return acc;
    },
    { answers: {} } as Answers
  );

const getMapsUrl = ({ vicinity, name, geometry }: Partial<Result>) => {
  const { lat, lng } = geometry!.location;
  [vicinity, name] = [vicinity, name].map((x) => x!.replaceAll(" ", "+"));
  return `[Open with Google Maps](https://www.google.com/maps/dir//${vicinity}+${name}/@${lat},${lng})`;
};

const handleUserId = () => {
  if (!localStorage.getItem("user_id")) {
    localStorage.setItem("user_id", uuid4());
  }
};

const handleConversationId = () => {
  localStorage.setItem("conversation_id", uuid4());
};

/**
 * A custom hook to handle the chat state and logic
 * Builds a payload after the final prompt
 */
export function useChat() {
  const [apiError, setApiError] = useState<string>();
  const [chat, setChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "🤖 Hello, I am Maria.\nI will help you find the right type of doctor to help with your symptoms. Please tell me about the symptoms you are experiencing.",
    },
  ]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [conversationIsCompleted, setConversationIsCompleted] =
    useState<boolean>();

  useEffect(() => {
    handleUserId();
    handleConversationId();
  }, []);

  const getRecommendations = async (payload: { payload: Payload }) => {
    try {
      const result = await apiPost(payload);
      showRecommendationsAsChatMessage(result);
    } catch (e) {
      console.error(e);
      setApiError(
        typeof (e as any)?.message === "string"
          ? (e as any).message
          : "There was an error while requesting recommendations from the server."
      );
    }
  };

  const getNextPrompt = () => {
    const prompt = prompts[currentPromptIndex + 1];
    setCurrentPromptIndex((prev) => prev + 1);
    return prompt;
  };

  const showRecommendationsAsChatMessage = (
    recommendations: Recomendations
  ) => {
    const recommendationChatMessages = recommendations?.results
      ?.filter(
        (result) =>
          result.business_status === "OPERATIONAL" &&
          result.vicinity &&
          result.name
      )
      .map((result) => {
        const { name, vicinity } = result;
        const mapsUrl = getMapsUrl(result);
        return {
          role: "assistant",
          content: `* ${name}\n* ${vicinity}\n* ${mapsUrl}`,
        } as ChatMessage;
      });

    setChatHistory((curr) => {
      const newHistory = [...curr, ...recommendationChatMessages];
      return newHistory;
    });
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
          content: "Getting recommendations...",
        });

        const conversation = {
          id: localStorage.getItem("conversationId") || uuid4(),
          answers: reduceChatHistoryToAnswers(chatHistory),
        };

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
        setConversationIsCompleted(true);
        getRecommendations({ payload });
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
    conversationIsCompleted,
    apiError,
  };
}
