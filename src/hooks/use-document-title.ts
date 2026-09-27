import { useEffect } from "react";

const SITE_NAME = "Round Rock Local";

/**
 * Sets the browser tab title to "{pageName} - Round Rock Local".
 * Pass an empty string to reset to just the site name.
 */
export function useDocumentTitle(pageName: string) {
  useEffect(() => {
    document.title = pageName
      ? `${pageName} - ${SITE_NAME}`
      : `${SITE_NAME} — Round Rock, TX Business Directory`;
    return () => {
      document.title = `${SITE_NAME} — Round Rock, TX Business Directory`;
    };
  }, [pageName]);
}
