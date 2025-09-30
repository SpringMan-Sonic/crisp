import { FaRobot } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";

export default function Message({ message }) {
  const isBot = message.sender === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-2`}>
      {isBot ? (
        <div className="flex gap-2 items-start">
          {/* Bot Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#0c1b3c] flex items-center justify-center text-yellow-400">
            <FaRobot className="h-6 w-6" />
          </div>

          {/* Bot Message */}
          <div className="bg-gradient-to-r from-[#1a2b55] to-[#0c1b3c] text-yellow-400 rounded-xl p-3 max-w-[75%] shadow-md break-words font-mono">
            {message.text}
            <div className="text-xs text-gray-400 mt-1 text-right">{message.timeStamp}</div>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 items-start">
          {/* User Message */}
          <div className="bg-[#0b1d3a] text-white rounded-xl p-3 max-w-[75%] shadow-md break-words font-mono">
            {message.text}
            <div className="text-xs text-gray-400 mt-1 text-right">{message.timeStamp}</div>
          </div>

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#0c1b3c] flex items-center justify-center text-yellow-400">
            <IoPerson className="h-6 w-6" />
          </div>
        </div>
      )}
    </div>
  );
}
