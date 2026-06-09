import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Parking Assistant 🚗", from: "bot" }
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  // 🔥 Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { text: userMessage, from: "user" },
      { text: "Typing...", from: "bot" }
    ]);

    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userMessage,
      });

      const reply = res?.data?.reply || "⚠️ No response from AI";

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: reply, from: "bot" }
      ]);

    } catch (error) {
      console.error("Chat Error:", error);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "⚠️ AI not responding. Try again later.", from: "bot" }
      ]);
    }
  };

  // 🔥 Send on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>

      {/* Floating Button */}
      <div style={styles.icon} onClick={() => setOpen(!open)}>
        💬
      </div>

      {/* Chat Box */}
      {open && (
        <div style={styles.box}>

          {/* Header */}
          <div style={styles.header}>
            Parking Assistant 🚗
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={msg.from === "user" ? styles.user : styles.bot}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about parking..."
            />
            <button style={styles.button} onClick={sendMessage}>
              ➤
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 9999,
    fontFamily: "Arial"
  },

  icon: {
    background: "linear-gradient(135deg, #6a5acd, #8a2be2)",
    color: "#fff",
    fontSize: "24px",
    padding: "15px",
    borderRadius: "50%",
    cursor: "pointer",
    textAlign: "center"
  },

  box: {
    width: "300px",
    height: "400px",
    background: "#fff",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column"
  },

  header: {
    background: "linear-gradient(135deg, #6a5acd, #8a2be2)",
    color: "#fff",
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center"
  },

  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto"
  },

  bot: {
    background: "#eee",
    padding: "8px",
    margin: "5px",
    borderRadius: "10px",
    maxWidth: "80%"
  },

  user: {
    background: "#6a5acd",
    color: "#fff",
    padding: "8px",
    margin: "5px",
    borderRadius: "10px",
    maxWidth: "80%",
    marginLeft: "auto"
  },

  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd"
  },

  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  button: {
    marginLeft: "5px",
    padding: "8px 12px",
    background: "#6a5acd",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};