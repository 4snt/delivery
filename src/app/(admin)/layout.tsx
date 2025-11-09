import { ReactNode } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
