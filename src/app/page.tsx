"use client";

import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Message } from "@/types/message";
import ConnectionStatus from "@/components/ConnectionStatus";
import ChatContainer from "@/components/ChatContainer";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
  const { connected, sendMessage, onMessage } = useWebSocket(wsUrl);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentAiMessageId, setCurrentAiMessageId] = useState<string | null>(
    null
  );
  const streamTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onMessage((data: string) => {
      setLoading(true);

      // Clear existing timeout
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }

      // Create or update AI message
      setMessages((prev) => {
        const existingIndex = prev.findIndex(
          (msg) => msg.id === currentAiMessageId
        );

        if (existingIndex !== -1) {
          // Update existing message
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            content: updated[existingIndex].content + data,
          };
          return updated;
        } else {
          // Create new message
          const newId = `ai-${Date.now()}`;
          setCurrentAiMessageId(newId);
          return [
            ...prev,
            {
              id: newId,
              role: "ai",
              content: data,
              timestamp: new Date().toISOString(),
            },
          ];
        }
      });

      // Set timeout to detect stream end (500ms of no data = stream complete)
      streamTimeoutRef.current = setTimeout(() => {
        setLoading(false);
        setCurrentAiMessageId(null);
      }, 500);
    });

    return () => {
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }
    };
  }, [onMessage, currentAiMessageId]);

  const handleSend = (content: string) => {
    if (!content.trim() || loading || !connected) return;

    // Clear any existing stream timeout
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = null;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setCurrentAiMessageId(null); // Reset for new AI response

    // Send message via WebSocket
    sendMessage(content);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ConnectionStatus connected={connected} />
      <ChatContainer messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} disabled={loading || !connected} />
    </div>
  );
}

