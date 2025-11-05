interface ConnectionStatusProps {
  connected: boolean;
}

export default function ConnectionStatus({ connected }: ConnectionStatusProps) {
  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm px-4 md:px-6 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full ${
                connected ? "bg-green-500" : "bg-red-500"
              } animate-pulse`}
            ></div>
            {connected && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75"></div>
            )}
          </div>
          <span
            className={`text-sm font-medium ${
              connected ? "text-green-700" : "text-red-700"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          RG-BOT
        </div>
      </div>
    </div>
  );
}

