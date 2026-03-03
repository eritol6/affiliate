export const GA_ID = "G-44YCT5H8P1";

export const pageview = (url: string) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, {
    page_path: url,
  });
};
