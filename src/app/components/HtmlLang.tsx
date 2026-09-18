'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

/** Sincroniza <html lang> con el locale de la ruta. */
export default function HtmlLang() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
