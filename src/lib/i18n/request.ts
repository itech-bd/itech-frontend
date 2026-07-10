import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  return {
    locale: isLocale(locale) ? locale : defaultLocale,
    messages: (await import(`../../messages/${isLocale(locale) ? locale : defaultLocale}.json`)).default,
  };
});
