import { Header } from "@/components/site/header";
import { SidebarNav } from "@/components/site/sidebar-nav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="site-container flex flex-col lg:flex-row lg:gap-10">
        <SidebarNav />
        {/* Extra room at the end so the floating player never covers the last lines. */}
        <div className="min-w-0 flex-1 py-10 pb-40 lg:py-12 lg:pb-40">{children}</div>
      </div>
    </>
  );
}
