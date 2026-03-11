import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({ title: "Admin" });

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
