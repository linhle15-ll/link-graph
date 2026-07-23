import { AppHeader } from "@/components/layout/app-header";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-dvh w-full flex-col bg-[#efeeea]">
      <AppHeader />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
