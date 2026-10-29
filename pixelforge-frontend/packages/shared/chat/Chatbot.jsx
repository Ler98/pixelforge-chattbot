import "./chatbot.css";
import "../../../src/index.css";
import { useEffect, useState, useRef } from "react";
import { Icon } from "../../base/icon/ui/index.jsx";
import { Bot, X, CircleArrowUp } from "lucide-react";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSendMessage() {
    if (message.trim() === "") {
      //trim kontrollerar så att användaren inte bara har skrivit mellanslag.
      return;
    }
    const userMessage = message;
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);

    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage,
          history: messages.map((msg) => ({
            //historik i chatten
            role: msg.sender === "user" ? "human" : "ai",
            content: msg.text,
          })),
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { text: data.answer, sender: "assistant" },
      ]);
    } catch (error) {
      console.error("Fel vid kontakt med chatboten:", error);
    }
  }

  return (
    <>
      <button
        className="chat__button"
        aria-label="Öppna chatten"
        onClick={() => {
          console.log("Knappen klickades!");
          setIsOpen(!isOpen);
        }}
      >
        <Icon icon={Bot} size={24} /> {/* icon från lucide-react */}
        {/* <i className="fa-solid fa-robot chat__icon"></i> */}
      </button>

      {isOpen && ( //visar när isOpen är true
        <div className="chat__window">
          <section className="chat__header-section">
            <h2 className="chat__title">PixelAI</h2>
            <button
              className="chat__close-button"
              aria-label="Stäng chatten"
              onClick={() => {
                setIsOpen(!isOpen); //stänger chatten
              }}
            >
              <Icon icon={X} size={15} />
              {/* <i className="fa-solid fa-x chat__ikon-close"></i> */}
            </button>
          </section>
          {/* <button onClick={() => setIsOpen(false)}>Stäng</button> */}

          <section className="chat__text-section">
            <p className="chat__text chat__text--assistant">
              Hej! Hur kan jag hjälpa dig?
            </p>
            {messages.map((msg, index) => (
              <p key={index} className={`chat__text chat__text--${msg.sender}`}>
                {msg.text}
              </p>
            ))}
            <div ref={messagesEndRef} />

            {/* <p key={index} className={`chat__text chat__text--${msg.sender}`}>
              {msg.text}
            </p> */}
          </section>
          <section className="chat__input-section">
            <button
              className="chat__send-button"
              aria-label="Skicka meddelande"
              onClick={handleSendMessage}
            >
              {/* <i className="fa-solid fa-circle-up chat__ikon-send"></i> */}
              <Icon
                className="chat__ikon-send"
                icon={CircleArrowUp}
                size={24}
              />
            </button>

            <input
              className="chat__input"
              type="text"
              placeholder="Skriv ett meddelande..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </section>
        </div>
      )}
    </>
  );
}

export default Chatbot;
