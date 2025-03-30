import Layout from "@/components/dashboard/layout"

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
} 