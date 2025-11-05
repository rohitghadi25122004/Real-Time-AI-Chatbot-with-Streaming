# Real-Time-AI-Chatbot-with-Streaming

Real-time AI chatbot with streaming responses using Groq API via WebSocket.

## Features

- Real-time streaming AI responses
- Responsive design
- Built with Next.js 14+ and TypeScript

## Setup

Install dependencies:
```bash
npm install
npm install ws openai dotenv
```

Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_WS_URL=ws://localhost:8080
GROQ_API_KEY=your_groq_api_key_here
```

Get Groq API key from https://console.groq.com/keys

## Running

Start frontend:
```bash
npm run dev
```

Start backend server (in separate terminal):
```bash
node server.js
```

Open http://localhost:3000

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- WebSocket
- Groq API

## Project Structure

```
src/
├── app/          # Main pages
├── components/   # React components
├── hooks/        # Custom hooks
├── types/        # TypeScript types
└── utils/        # Utility functions
```
