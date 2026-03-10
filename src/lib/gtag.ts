//This file contains utility functions for Google Analytics tracking

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

//Track a page view
export const pageview = (url: string) => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;

  (window as any).gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

//Track custom events - anime clicks, search queries, genre selections
export const gaEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;

  (window as any).gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
