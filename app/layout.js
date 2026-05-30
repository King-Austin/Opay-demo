import "./globals.css";
import Nav from "@/components/Nav";
import { PidginProvider } from "@/contexts/PidginContext";

export const metadata = {
  title: "AjoStack — Digital Ajo & Micro-Credit on OPay",
  description: "AI-powered digital thrift & micro-credit for Nigeria's 14.6 million ajo/esusu users. Built on OPay rails.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ECEAE4",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PidginProvider>
          <Nav />
          {children}
        </PidginProvider>
      </body>
    </html>
  );
}
