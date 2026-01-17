/**
 * ALl utility/helper functions for the application. Any reusable block of code should be
 * placed here.
 */

import { PAGINATION_CONFIG } from "@/constants";

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toTitleCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (char) => char.toUpperCase());
};

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const buildPageUrl = (
  searchParams: SearchParams,
  newPage: number,
) => {
  const { pageParam } = PAGINATION_CONFIG;
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  params.set(pageParam, String(newPage));
  return `/?${params.toString()}`;
}