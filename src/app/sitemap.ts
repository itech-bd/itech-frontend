import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/courses",
  "/solutions/software-solutions",
  "/solutions/it-solutions",
  "/solutions/web-hosting-solutions",
  "/mentors",
  "/reviews",
  "/news",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return ["en", "bn"].flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
    })),
  );
}
