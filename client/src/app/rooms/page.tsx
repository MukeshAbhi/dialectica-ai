import { Card, CardAction, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconHome, IconUsers, IconSettings, IconLogout, IconUser } from "@tabler/icons-react";
import React from "react";

export default function RoomPage() {
  const roomArr = [
    { title: "Cats are better than dogs", roomOwner: "Ada Lovelace", totalMembers: "2" },
    { title: "Winter is better than summer", roomOwner: "Linus Torvalds", totalMembers: "8" },
    { title: "Homework should be banned", roomOwner: "Grace Hopper", totalMembers: "4" },
    { title: "Weekends should be 3 days long", roomOwner: "James Gosling", totalMembers: "6" },
  ];

  const links = [
    {
      label: "Home",
      href: "/",
      icon: <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Rooms",
      href: "/rooms",
      icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <IconLogout className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-screen mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen">
      {/* sidebar repeated */}
      <Sidebar>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Anant Kavuru",
                href: "#",
                icon: (
                  <div className="h-7 w-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    AK
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* main central rightly aligned content... 2/3rd ish space */}
      <div className="flex flex-1">
        <div className="p-6 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full overflow-auto">
          <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-neutral-700">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Active Rooms</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Join a debate room or create your own
              </p>
            </div>
            <Button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
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