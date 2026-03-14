// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/terminal",
    },
    sitemap: "https://ericdelosreyes.com/sitemap.xml",
  };
}