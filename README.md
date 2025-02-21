# Telegram Connector Service

This repository contains the **Connector Service**, a service developed in **Node.js** that acts as an intermediary between Telegram and the **Bot Service**. It receives messages sent by users on Telegram, forwards them to the **Bot Service** for processing, and returns the appropriate responses.

## Technologies Used

- **Node.js** (LTS)
- **Express.js** for API creation
- **telegram-bot-api** for interaction with Telegram
- **node-fetch** for communication with the Bot Service
- **dotenv** for environment variable management
- **ngrok** created a url open in the internet so that Telegram's webhuk can send me messages.

## Setup and Execution

### 1. Clone the Repository
```sh
git clone https://github.com/henriqueSpencer/telegram-connector-service.git
cd connector-service
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a **.env** file in the root of the project and define the following variables:
```ini
TELEGRAM_BOT_TOKEN=""
BOT_SERVICE_URL=""
WEBHOOK_URL=""
BOT_SERVICE_API_KEY=""
```

### 4. Start ngrok url
```sh
ngrok http 3000
```

### 5. Start the Server
```sh
npm start
```

The service will be available on the port specified in the `.env` file.

## How It Works

1. The service registers a **webhook** with Telegram to receive messages.
2. When a user sends a message to the bot, Telegram forwards it to this service via the webhook.
3. The **Connector Service** extracts the message data and sends it to the **Bot Service** for processing.
4. The **Bot Service** returns a formatted response.
5. The **Connector Service** sends this response back to Telegram so the user receives it.

## Project Structure

```
connector-service/
├── .env               # Environment Variables
├── package.json       # Node.js configuration
├── index.mjs          # Application 
```

## Final Considerations
- Ensure that the **Bot Service** is running before starting this service.
- If you want to test the API locally, using **ngrok** to expose the local server is recommended.
- Detailed logs are printed to the console to assist debugging.
