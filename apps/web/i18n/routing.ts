import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi', 'ar'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];
