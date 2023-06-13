import { Dispatch, SetStateAction, useEffect } from "react";
import GeolocationComponent from "./GeolocationComponent";
import uuid4 from "uuid4";

const handleUserId = () => {
  if (!localStorage.getItem("user_id")) {
    localStorage.setItem("user_id", uuid4());
  }
};

const handleConversationId = () => {
  localStorage.setItem("conversation_id", uuid4());
};

export const Welcome: React.FC<{
  setGeolocationPosition: Dispatch<
    SetStateAction<GeolocationPosition | undefined>
  >;
}> = ({ setGeolocationPosition }) => {
  useEffect(() => {
    handleUserId();
    handleConversationId();
  }, []);

  return (
    <div className="bg-white border-gray-100 border-2 rounded-lg px-8 py-5 mr-20 w-full">
      <h1 className="text-2xl font-bold mb-2">🤖 Hello, I am Maria.</h1>
      <p>
        I will help you find the right type of doctor to help with your
        symptoms. Please tell me about the symptoms you are experiencing.
      </p>
      <p>
        {/* <a className="underline" href="#">
        Disclaimer
      </a> */}
      </p>
      <GeolocationComponent setGeolocationPosition={setGeolocationPosition} />
    </div>
  );
};
