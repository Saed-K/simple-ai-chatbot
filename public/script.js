document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const chatContainer = document.getElementById("chat-container");

  sendButton.addEventListener("click", sendMessage);

  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return; // Prevent sending empty messages

    // Display user message in chat
    displayMessage(message, "user-message");
    userInput.value = ""; // Clear input field

    try {
      // Send message to server and get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      displayMessage(data.reply, "bot-message"); // Display bot response
    } catch (error) {
      console.error("Error sending message to server:", error);
      displayMessage(
        "Sorry, I could not process your request at this time.",
        "bot-message error-message"
      );
    }
  }

  function displayMessage(message, messageType) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", messageType);
    messageDiv.textContent = message;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
});
document.getElementById("toggle-dark-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
