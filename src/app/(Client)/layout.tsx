import Navbar from "@/components/ui/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-screen h-screen">
      <div className="w-full h-[8%]">
        <Navbar />
      </div>

      <div className="w-full h-[84%]">{children}</div>
    </main>
  );
}
