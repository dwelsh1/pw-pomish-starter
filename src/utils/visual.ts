import type { Page } from '@playwright/test';

export async function stabilizeForSnapshot(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addStyleTag({ content: `
    * { transition: none !important; animation: none !important; caret-color: transparent !important; }
    html { scroll-behavior: auto !important; }
  `});
}
