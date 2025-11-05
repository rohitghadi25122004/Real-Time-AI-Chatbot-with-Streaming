import { useEffect, useRef, useState, useCallback } from "react";

interface UseWebSocket {
  connected: boolean;
  sendMessage: (msg: string) => void;
  onMessage: (callback: (data: string) => void) => void;
}

export const useWebSocket = (url: string): UseWebSocket => {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messageCallbackRef = useRef<((data: string) => void) | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        if (messageCallbackRef.current) {
          messageCallbackRef.current(event.data);
        }
      };

      ws.onerror = () => {
        setConnected(false);
      };

      ws.onclose = () => {
        setConnected(false);
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      setConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    }
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((msg: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    }
  }, []);

  const onMessage = useCallback((callback: (data: string) => void) => {
    messageCallbackRef.current = callback;
  }, []);

  return {
    connected,
    sendMessage,
    onMessage,
  };
};

