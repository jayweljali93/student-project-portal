import React from "react";

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-msg ${message.from === "admin" ? "admin" : "student"}`}>
      <p>{message.text}</p>
      <span>{message.time}</span>
    </div>
  );
};

export default ChatMessage;
