"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { MessageCircle } from "lucide-react"; // optional icon

type ChatbotResponse = {
  response: string;
  followup_questions?: string[];
};

type ChatMessage = {
  sender: "user" | "bot";
  message: string;
};

export default function ChatbotCard({ initial }: { initial: ChatbotResponse }) {
  const [chat, setChat] = useState<ChatMessage[]>([
    { sender: "bot", message: initial.response },
  ]);
  const [userInput, setUserInput] = useState("");
  const [followups, setFollowups] = useState(initial.followup_questions || []);
  const [minimized, setMinimized] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { sender: "user", message }]);
    setUserInput("");

    try {
      const res = await fetch(
        "https://studybuddy.allanhanan.qzz.io/api/chatbot/query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      const data: ChatbotResponse = await res.json();
      setChat((prev) => [...prev, { sender: "bot", message: data.response }]);
      setFollowups(data.followup_questions || []);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", message: "Sorry, something went wrong." },
      ]);
    }
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:scale-105 transition"
        aria-label="Open Chat"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[320px] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg bg-card border">
      <Card className="bg-card text-card-foreground border-none w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg">AI Chat</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMinimized(true)}
            className="text-muted-foreground"
          >
            Minimize
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 ${
                msg.sender === "user" ? "justify-end" : ""
              }`}
            >
              {msg.sender === "bot" && (
                <Avatar>
                  <AvatarFallback>🤖</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.message}
              </div>
              {msg.sender === "user" && (
                <Avatar>
                  <AvatarFallback>🧑</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {followups.length > 0 && (
            <div className="flex flex-col gap-2 pt-2">
              {followups.map((q, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="justify-start text-left text-muted-foreground"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something..."
          />
          <Button onClick={() => sendMessage(userInput)}>Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
