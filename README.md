# WhatsApp Send Message

This project is a solution for sending messages via WhatsApp, using the whatsapp-web.js library. For queue management, it employs RabbitMQ and Bull. Additionally, Prisma is used for persisting messages in a database.

# :pushpin: Table of Contents
<img align="right" src="https://github.com/wwebjs/logos/blob/main/4_Full%20Logo%20Lockup_Small/small_banner_blue.png?raw=true" alt="WWebJS logo" width="500" />
<a href="https://wwebjs.dev/"><img align="right" src="https://wwebjs.dev/images/logo.png" alt="WWebJS logo" width="100" /></a>

- ⚡ [Technologies](#technologies)
- ⚙️ [Features](#features)
- ⚠️ [Requirements](#requirements)
- 🛠️ [Installation](#installation)
- 🤔 [How It Works](#how-it-works)
- 📁 [Folder Structure](#folder-structure)
- 🪪 [License](#license)

## ⚡ Technologies

- **Node.js**: Runtime environment.
- **Express**: Framework for REST APIs.
- **TypeScript**: Superset of JavaScript for static typing.
- **RabbitMQ**: Messaging system.
- **Bull**: Queue processing library for Node.js.
- **Prisma**: ORM for database interaction.
- **whatsapp-web.js**: Integration with WhatsApp.

## ⚙️ Features

- **Message sending via WhatsApp**: Messages are queued and sent through WhatsApp using whatsapp-web.js.
- **Data persistence**: All successfully sent messages are saved in the database using PostgreSQL.
- **Queue management**: Utilizes RabbitMQ to manage the message queue and Bull to reprocess messages in case of failure.
- **Automatic retries**: If sending a message fails, Bull attempts to reprocess the message with exponential backoff.

## ⚠️ Requirements
> [!NOTE]
> **Node ``v18+`` is required.**
> 
> **Docker**
> 
> **Docker Compose**

## 🛠️ Installation
1. Download or clone this repo.
   ```bash
   git clone https://github.com/BrunoSobralDEV/whats-sender.git
   ```
2. Enter to the project directory.
    ```bash
   cd whats-sender
   ```
3. Execute npm or yarn install to install the dependencies.
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn
   ```
4. Copy .env.example to .env and set the environment variables.
5. Docker, execute:
   ```bash
   docker compose up -d
   ```
6. Run migration
   ```bash
   npx prisma migrate dev --name init
   ```
7. Start project
   ```bash
   npm run server
   ```
8. 📱 Authenticate with WhatsApp
When the project starts, it will display a QR Code in the console to authenticate WhatsApp. Scan this QR Code with your WhatsApp application to connect.

## 🤔 How It Works
1. **POST /send-message route**: receives the request and adds the message to the queue (Bull);
Example of request:
```bash
POST /send-message
{
  "phone": "+5571987654321",
  "message": "HI, this is a test message!"
}
```
2. The message is processed and published to RabbitMQ;
3. The RabbitMQ consumer sends the message via WhatsApp;
4. The result is stored in PostgreSQL and errors are logged in the console.

### 📁 Folder Structure
```bash
├── prisma                 # Prisma configuration and database schema
├── src
│   ├── controllers        # Route controllers
│   ├── middlewares        # Middlewares
│   ├── routes             # Route definitions
│   ├── services           # Messaging and WhatsApp services
│   ├── utils              # Utility functions
├── .env                   # Environment variables configuration file
└── package.json           # Project settings and dependencies
```
## 🪪 License
This project is licensed under the MIT License.