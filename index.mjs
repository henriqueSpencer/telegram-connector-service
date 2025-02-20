import express from "express";
import fetch from "node-fetch";
import TelegramBotApi from "telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

// Verifica se todas as variáveis de ambiente estão definidas
if (
  !process.env.TELEGRAM_BOT_TOKEN ||
  !process.env.BOT_SERVICE_URL ||
  !process.env.WEBHOOK_URL
) {
  console.error(
    "❌ Missing environment variables. Check TELEGRAM_BOT_TOKEN, BOT_SERVICE_URL, and WEBHOOK_URL."
  );
  process.exit(1);
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_SERVICE_URL = process.env.BOT_SERVICE_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

const app = express();
app.use(express.json());

const bot = new TelegramBotApi({ token: TELEGRAM_BOT_TOKEN });

// ✅ Função para configurar o webhook do Telegram
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

// ✅ Configurar webhook ao iniciar
setTelegramWebhook();

// ✅ Servidor Express está rodando
console.log("🤖 Telegram Connector Service is running...");

// ✅ Rota para lidar com mensagens do Telegram
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

    // ✅ Enviar mensagem para o Bot Service (Python)
    // const response = await fetch(BOT_SERVICE_URL, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ chat_id: chatId, text: userMessage }),
    // });

    // const data = await response.json();

    // if (data && data.reply) {
    //   // ✅ Enviar a resposta do Bot Service de volta para o usuário no Telegram
    //   await bot.sendMessage({ chat_id: chatId, text: data.reply });
    //   console.log(`📤 Sent response to ${chatId}: ${data.reply}`);
    // } else {
    //   console.warn("⚠️ Bot Service returned an unexpected response:", data);
    // }
  } catch (error) {
    console.error("❌ Error processing message:", error);
  }

  res.sendStatus(200);
});

// ✅ Iniciar o servidor Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Connector Service listening on port ${PORT}`)
);
