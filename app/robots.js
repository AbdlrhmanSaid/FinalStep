export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/*", "/api/*"],
      },
    ],
    sitemap: "https://final-step.vercel.app/sitemap.xml",
  };
}
