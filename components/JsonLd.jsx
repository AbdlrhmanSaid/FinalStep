export default function JsonLd({ type = "WebSite" }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    name: "Final Step",
    description:
      "The ultimate platform for project management and team collaboration",
    url: "https://final-step.vercel.app",
    logo: "https://final-step.vercel.app/logo.png",
    sameAs: [
      // "https://facebook.com/finalstep",
      // "https://twitter.com/finalstep",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://final-step.vercel.app/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
