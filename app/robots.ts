// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/fixer",
    },
    sitemap: "https://ericdelosreyes.com/sitemap.xml",
  };
}