"use client";

import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconUsers, IconUser } from "@tabler/icons-react";
import React from "react";
import { useRouter } from "next/navigation";

export default function RoomPage() {
  const router = useRouter();
  
  const roomArr = [
    { title: "Cats are better than dogs", roomOwner: "Ada Lovelace", totalMembers: "2", roomId: "cats-vs-dogs" },
    { title: "Winter is better than summer", roomOwner: "Linus Torvalds", totalMembers: "8", roomId: "winter-summer" },
    { title: "Homework should be banned", roomOwner: "Grace Hopper", totalMembers: "4", roomId: "homework-debate" },
    { title: "Weekends should be 3 days long", roomOwner: "James Gosling", totalMembers: "6", roomId: "3day-weekend" },
  ];

  const handleJoinRoom = (roomId: string) => {
    router.push(`/main/debate/${roomId}`);
  };

  const handleCreateRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 8);
    router.push(`/main/debate/${randomId}`);
  };

  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-screen mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen">
      {/* main central rightly aligned content... 2/3rd ish space */}
      <div className="flex flex-1">
        <div className="p-6 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full overflow-auto">
          <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-neutral-700">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Active Rooms
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Join a debate room or create your own
              </p>
            </div>
            <Button 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              onClick={handleCreateRoom}
            >
              Create Room
            </Button>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomArr.map((room, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-neutral-900 dark:text-neutral-100">
                    {room.title}
                  </CardTitle>
                  <CardAction>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleJoinRoom(room.roomId)}
                    >
                      Join
                    </Button>
                  </CardAction>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <IconUsers className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {room.totalMembers} members
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="text-sm text-neutral-600 dark:text-neutral-400">
                  <IconUser className="h-4 w-4 mr-2" />
                  Created by <span className="font-semibold ml-1">{room.roomOwner}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
