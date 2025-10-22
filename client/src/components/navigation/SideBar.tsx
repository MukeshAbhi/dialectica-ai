"use client";

import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconHome, IconUsers, IconSettings, IconLogout } from "@tabler/icons-react";
import { useSession, signOut } from "next-auth/react"; 
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  callbackUrl: string;
};

const LogoutButton = ({ callbackUrl }: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Show toast immediately
      toast.success("Successfully logged out", { duration: 5000 });

      // Prevent automatic redirect from signOut
      await signOut({ redirect: false });

      // Delay navigation slightly so toast is visible
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1000); // 1 second delay
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Error logging out. Please try again.", { duration: 5000 });
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full text-left"
    >
      <SidebarLink
        link={{
          label: "Logout",
          href: "#",
          icon: <IconLogout className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        }}
      />
    </button>
  );
};

function SideBar() {
  const { data: session } = useSession();

  const LOGOUT_REDIRECT_PATH = "/"; 

  const links = [
    {
      label: "Home",
      href: "/main",
      icon: <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Rooms",
      href: "/main/rooms",
      icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "/main/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
            <LogoutButton callbackUrl={LOGOUT_REDIRECT_PATH} />
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: session?.user?.name || "User",
              href: "#",
              icon: session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <div className="h-7 w-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {getUserInitials(session?.user?.name)}
                </div>
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
} 

export default SideBar;
