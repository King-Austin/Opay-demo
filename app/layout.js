import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "AjoStack — Digital Ajo & Micro-Credit on OPay",
  description: "AI-powered digital thrift & micro-credit for Nigeria's 14.6 million ajo/esusu users. Built on OPay rails.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
