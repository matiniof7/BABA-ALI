import type { ReactNode } from "react";

export const metadata = {
  title: "پنل مدیریت | یخبندان",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
