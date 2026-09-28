/**
 * Renders structured data as recommended in the Next.js JSON-LD guide:
 * `<` is escaped so no string inside the data can close the script tag.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
