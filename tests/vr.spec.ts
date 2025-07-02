import { expect, test } from '@playwright/test';

test.describe('vr page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show vr page in desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot({ fullPage: true });
  });

  test('should show vr page in mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});
