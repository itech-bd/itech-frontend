import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/en/student", "/bn/student", "/en/login", "/bn/login", "/en/register", "/bn/register", "/en/forgot-password", "/bn/forgot-password", "/en/reset-password", "/bn/reset-password", "/en/verify-email", "/bn/verify-email", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
