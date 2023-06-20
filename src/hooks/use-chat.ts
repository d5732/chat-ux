import { Recomendations, Result } from "../types/recommendations.types";
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

  // Edge API enriches and forwards requests to Snack Dandies back end
  // i.e. append private remote database API token
  // TODO: uncomment to unmock
  // const response = await fetch(EDGE_API_PATH, {
  //   body,
  //   method: "POST",
  // });

  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`);
  // }

  // const data = await response.json();
  const mockData: Recomendations = {
    html_attributions: [],
    results: [
      {
        business_status: "OPERATIONAL",
        geometry: {
          location: {
            lat: -33.8670835,
            lng: 151.2120446,
          },
          viewport: {
            northeast: {
              lat: -33.86574787010728,
              lng: 151.2135504798927,
            },
            southwest: {
              lat: -33.86844752989272,
              lng: 151.2108508201073,
            },
          },
        },
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        icon_background_color: "#7B9EB0",
        icon_mask_base_uri:
          "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        name: "Dr Browne Christopher D",
        opening_hours: {},
        place_id: "ChIJ74qT9mquEmsR9qB-YzWzGyY",
        plus_code: {
          compound_code: "46M6+5R Sydney, New South Wales",
          global_code: "4RRH46M6+5R",
        },
        rating: 4.1,
        reference: "ChIJ74qT9mquEmsR9qB-YzWzGyY",
        scope: "GOOGLE",
        types: ["doctor", "point_of_interest", "health", "establishment"],
        user_ratings_total: 9,
        vicinity: "193 Macquarie St, Sydney",
      },
      {
        business_status: "OPERATIONAL",
        geometry: {
          location: {
            lat: -33.8762429,
            lng: 151.2125209,
          },
          viewport: {
            northeast: {
              lat: -33.87478277010727,
              lng: 151.2137371798927,
            },
            southwest: {
              lat: -33.87748242989272,
              lng: 151.2110375201072,
            },
          },
        },
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        icon_background_color: "#7B9EB0",
        icon_mask_base_uri:
          "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        name: "Dr Gemma Winkler",
        opening_hours: {
          open_now: true,
        },
        place_id: "ChIJ5ffiNsOvEmsRLhz6U0Jc2wA",
        plus_code: {
          compound_code: "46F7+G2 Darlinghurst, New South Wales",
          global_code: "4RRH46F7+G2",
        },
        rating: 5,
        reference: "ChIJ5ffiNsOvEmsRLhz6U0Jc2wA",
        scope: "GOOGLE",
        types: ["doctor", "point_of_interest", "health", "establishment"],
        user_ratings_total: 2,
        vicinity: "Suite 1, Level 7/26 College St, Darlinghurst",
      },
    ],
    status: "OK",
  };

  console.log({ mockData });
  return mockData;
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

/**
 * A custom hook to handle the chat state and logic
 * Builds a payload after the final prompt
 */
export function useChat() {
  const [apiError, setApiError] = useState<string>();
  const [chat, setChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [conversationIsCompleted, setConversationIsCompleted] =
    useState<boolean>();

  const getRecommendations = async (payload: { payload: Payload }) => {
    try {
      const result = await edgePost(payload);
      showRecommendationsAsChatMessage(result);
    } catch (e) {
      console.error(e);
      setApiError(
        typeof (e as any)?.message === "string"
          ? (e as any).message
          : "There was an error during recommendations service request."
      );
    }
  };

  const getNextPrompt = () => {
    const prompt = prompts[currentPromptIndex + 1];
    setCurrentPromptIndex((prev) => prev + 1);
    return prompt;
  };

  const getMapsUrl = ({ vicinity, name, geometry }: Partial<Result>) => {
    const { lat, lng } = geometry!.location;
    [vicinity, name] = [vicinity, name].map((x) => x!.replaceAll(" ", "+"));
    return `[Open with Google Maps](https://www.google.com/maps/dir//${vicinity}+${name}/@${lat},${lng})`;
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
  };
}
