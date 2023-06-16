import { useState, useMemo, useEffect, useRef } from "react";
import { App } from "../App";
import { useChat } from "../hooks/use-chat";
import { ChatMessage } from "../components/ChatMessage";
import { Welcome } from "../components/Welcome";
import GeolocationComponent from "../components/GeolocationComponent";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth, authenticateWithEmail } from '../firebase';
import { User } from "firebase/auth";
import Signin from "../components/auth/Signin";
import DoctorLookup from "../components/DoctorLookup";

export default function Index() {
  // The content of the box where the user is typing
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

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    // TODO: Add email input
    authenticateWithEmail("movetojunk@gmail.com");
    window.localStorage.setItem('emailForSignIn', "movetojunk@gmail.com");
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <App title="Find a doctor with the help of AI">
      <div>
      <Router>
        <header>
          <h1>Expense Tracker</h1>
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </header>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signin />} />
          <Route path="/doctor-lookup" element={<DoctorLookup />} />
        </Routes>
      </Router>
    </div>
    
      {/* <main className="bg-white md:rounded-lg md:shadow-md p-6 w-full h-full flex flex-col">
        <section className="overflow-y-auto flex-grow mb-4 pb-8">
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
              className="w-full rounded-l-lg p-2 outline-none"
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
      <GeolocationComponent setGeolocationPosition={setGeolocationPosition} /> */}
    </App>
  );
}
