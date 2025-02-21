import express from "express";
import fetch from "node-fetch";
import TelegramBotApi from "telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_SERVICE_URL = process.env.BOT_SERVICE_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const BOT_SERVICE_API_KEY = process.env.BOT_SERVICE_API_KEY;

const app = express();
app.use(express.json());

const bot = new TelegramBotApi({ token: TELEGRAM_BOT_TOKEN });

// Function to set up the Telegram webhook
async function setTelegramWebhook() {
  try {
    const webhookUrl = `${WEBHOOK_URL}/webhook`;
    console.log(`🔗 Setting webhook to: ${webhookUrl}`);

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${webhookUrl}`,
      { method: "POST" }
    );

    const data = await response.json();
    if (data.ok) {
      console.log("✅ Webhook set successfully:", data);
    } else {
      console.error("❌ Failed to set webhook:", data);
    }
  } catch (error) {
    console.error("❌ Error setting webhook:", error);
  }
}

// Set up the webhook on startup
setTelegramWebhook();

// Express server is running
console.log("🤖 Telegram Connector Service is running...");

// Route to handle Telegram messages
app.post("/webhook", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.text) {
      console.warn("⚠️ Received an invalid message:", req.body);
      return res.sendStatus(400);
    }

    const chatId = message.chat.id;
    const userMessage = message.text;

    console.log(`📩 Received message from ${chatId}: ${userMessage}`);
    console.log(BOT_SERVICE_API_KEY);

    // Send the message to the Bot Service (Python)
    const response = await fetch(BOT_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": BOT_SERVICE_API_KEY,
      },
      body: JSON.stringify({
        chat_id: chatId, // Maps to `request.chat_id` in FastAPI
        text: userMessage, // Maps to `request.text` in FastAPI
      }),
    });

    const data = await response.json();

    if (data && data.reply) {
      // Send the Bot Service's response back to the user on Telegram
      await bot.sendMessage({ chat_id: chatId, text: data.reply });
      console.log(`📤 Sent response to ${chatId}: ${data.reply}`);
    } else {
      console.warn("⚠️ Bot Service returned an unexpected response:", data);
    }
  } catch (error) {
    console.error("❌ Error processing message:", error);
  }

  res.sendStatus(200);
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Connector Service listening on port ${PORT}`)
);
