import { Message } from "@/types/message";
import { formatTime } from "@/utils/formatTime";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const timestamp = new Date(message.timestamp);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div className="flex items-end gap-2 max-w-[85%] md:max-w-[75%]">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg flex-shrink-0">
            AI
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 shadow-lg transition-all duration-200 ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-md"
              : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
          }`}
        >
          <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
          <p
            className={`text-xs mt-2 opacity-70 ${
              isUser ? "text-blue-100" : "text-gray-400"
            }`}
          >
            {formatTime(timestamp)}
          </p>
        </div>
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg flex-shrink-0">
            You
          </div>
        )}
      </div>
    </div>
  );
}

