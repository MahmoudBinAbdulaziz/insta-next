import SessionWrapper from "@/components/SessionWrapper";
import Header from "../components/header";
import "./globals.css";

export const metadata = {
  title: "Instagram Clone",
  description: "A clone of Instagram built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body>
          <Header />
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
