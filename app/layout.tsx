import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "./context"          

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eric Delos Reyes - Software Engineer",
  description: "This portfolio was created and used by Eric Delos Reyes for career purposes.",
  metadataBase: new URL("https://ericdelosreyes.com"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "Eric - Software Engineer",
    description: "I’m a systems-oriented software engineer who enjoys breaking problems down to their fundamentals and rebuilding them into better solutions. I tend to question why a system exists before building it, which leads me to design architectures focused on maintainability, performance, and long-term scalability. Recently, I’ve been exploring AI-driven applications and how intelligent systems can support better decision-making. Outside of coding, I enjoy bending the rules of the games I play, the food I cook, and sometimes, just a normal person binging K-Drama and Anime.",
    url: "https://ericdelosreyes.com/",
    type: "website",
    images: [
      {
        url: "https://ericdelosreyes.com/images/DelosReyes.png",
        width: 1200,
        height: 630,
        alt: "Eric Delos Reyes Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric - Software Engineer",
    description: "Ready to connect? Whether it's a project, collaboration, or just a conversation about tech — thericodere@gmail.com",
    images: ["https://ericdelosreyes.com/images/DelosReyes.png"],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SpeedInsights />
      <Analytics/>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body
        className={`
          ${spaceGrotesk.variable} 
          ${jetbrainsMono.variable}
          
          antialiased
          
          `}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
