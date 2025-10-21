import SideBar from "@/components/navigation/SideBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function appLayout({ children }: AppLayoutProps) {
  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-screen mx-auto border border-neutral-200 dark:border-neutral-700">
      <SideBar />
      {children}
    </div>
  );
}
