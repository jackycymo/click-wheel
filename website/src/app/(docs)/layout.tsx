import { Header } from "@/components/site/header";
import { SidebarNav } from "@/components/site/sidebar-nav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-col px-5 lg:flex-row lg:gap-10">
        <SidebarNav />
        <div className="min-w-0 flex-1 py-10 pb-24 lg:py-12">{children}</div>
      </div>
    </>
  );
}
