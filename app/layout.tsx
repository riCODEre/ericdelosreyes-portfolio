import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eric - Software Engineer",
  description: "This portfolio was created and used by Eric Delos Reyes for career purposes.",
  openGraph: {
    title: "Eric - Software Engineer",
    description: "Ready to connect? Whether it's a project, collaboration, or just a conversation about tech — thericodere@gmail.com",
    url: "https://ericdelosreyes.com/",
    type: "website",
    images: [
      {
        url: "https://ericdelosreyes.com/images/DelosReyes.png", // your share image
        width: 1200,
        height: 630,
        alt: "Eric Delos Reyes Portfolio"
      }
    ]
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics/>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body
        className={`
          ${spaceGrotesk.variable} 
          ${jetbrainsMono.variable}
          
          antialiased
          
          `}
      >
        {children}
      </body>
    </html>
  );
}
