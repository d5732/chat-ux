import { useState, useEffect, useRef } from "react";
import { App } from "../App";
import { useChat } from "../hooks/use-chat";
import { ChatMessage } from "../components/ChatMessage";
import { Welcome } from "../components/Welcome";
import GeolocationComponent from "../components/GeolocationComponent";

export default function Index() {
  // The content of the box where the user is typing
  const [message, setMessage] = useState<string>("");

  // This hook is responsible for managing the chat and communicating with the
  // backend
  const { chat, chatHistory, sendMessage, conversationIsCompleted } = useChat();

  // This is a ref to the bottom of the chat history. We use it to scroll
  // to the bottom when a new message is added.
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat, chatHistory]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // This is a ref to the input box. We use it to focus the input box when the
  // user clicks on the "Send" button.
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <App title="Find a doctor with the help of AI">
      <main className="bg-white md:rounded-lg md:shadow-md p-6 w-full h-full flex flex-col">
        <section className="overflow-y-auto flex-grow mb-4 pb-8">
          <div className="flex flex-col space-y-4">
            {chatHistory.length === 0 ? (
              <>
                <Welcome />
                <div className="flex justify-center">
                  <p className="text-sm text-gray-500 mt-5">
                    Built by 🤖{" "}
                    <a
                      className="underline"
                      href="https://github.com/d5732/chat-ux"
                    >
                      Snack Dandies
                    </a>
                  </p>
                </div>
              </>
            ) : (
              chatHistory.map((chat, i) => (
                <ChatMessage key={i} message={chat} />
              ))
            )}
          </div>
          <div ref={bottomRef} />
        </section>

        <section className="bg-gray-100 rounded-lg p-2">
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(message);
              setMessage("");
            }}
          >
            <input
              type="text"
              ref={inputRef}
              className="w-full rounded-l-lg p-2 outline-none"
              placeholder={"Type your message..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
              type="submit"
              disabled={!message || !!conversationIsCompleted}
            >
              Send
            </button>
          </form>
        </section>
      </main>
      <GeolocationComponent />
    </App>
  );
}
