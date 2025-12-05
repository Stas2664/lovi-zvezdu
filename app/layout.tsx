import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ЛОВИ ЗВЕЗДУ",
  description: "Получай Telegram Stars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className="antialiased min-h-screen flex flex-col items-center justify-center bg-[#efeff3]">
        <main className="w-full max-w-[420px] min-h-screen bg-white shadow-xl overflow-hidden relative">
          {children}
        </main>
      </body>
    </html>
  );
}

