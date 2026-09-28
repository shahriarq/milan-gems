import { notFound } from "next/navigation";

/**
 * Any unknown path under a locale (e.g. /it/pagina-inesistente) renders the
 * localized [lang]/not-found page inside the site layout, instead of the
 * framework's generic 404.
 */
export default function CatchAll() {
  notFound();
}
