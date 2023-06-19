import { useState, useMemo, useEffect, useRef, Fragment } from "react";
import GeolocationComponent from "./GeolocationComponent";
import { useChat } from "../hooks/use-chat";
import { ChatMessage } from "./ChatMessage";
import { Welcome } from "./Welcome";
import { Container } from "react-bootstrap";

const DoctorLookup = () => {
    const [message, setMessage] = useState<string>("");
    const [geolocationPosition, setGeolocationPosition] =
        useState<GeolocationPosition>();

    // This hook is responsible for managing the chat and communicating with the
    // backend
    const { chat, chatHistory, sendMessage, completed } = useChat();

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
    <div className="h-full w-full">
        <main className="bg-white md:rounded-lg md:shadow-md p-6 h-full flex flex-col min-h-[640px] min-w-full">
        <section className="overflow-y-auto flex-grow mb-4 pb-8 ">
          <div className="flex flex-col space-y-4">
            {chatHistory.length === 0 ? (
              <>
                <Welcome setGeolocationPosition={setGeolocationPosition} />
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
              className="w-full rounded-l-lg p-2 outline-none bg-white"
              placeholder={"Type your message..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
              type="submit"
              disabled={!message || !!completed}
            >
              Send
            </button>
          </form>
        </section>
      </main>
      <GeolocationComponent setGeolocationPosition={setGeolocationPosition} />
    </div>
  )
}

export default DoctorLookup
