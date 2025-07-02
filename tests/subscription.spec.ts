import { test, expect } from '@playwright/test';

test.describe('subscription form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('error message when email is missing', async ({ page }) => {
    await page.getByRole('button', { name: 'Subscribe' }).click();
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('error message when GDPR is not accepted', async ({ page }) => {
    await page.getByRole('button', { name: 'Subscribe' }).click();
    await expect(
      page.getByText('You must agree to receive emails to continue.'),
    ).toBeVisible();
  });

  test('should show success message when form is submitted', async ({
    page,
  }) => {
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page
      .getByRole('checkbox', { name: 'I agree to receive emails' })
      .click();
    let apiHasBeenCalled = false;

    await page.route('api/subscribe', async (route) => {
      apiHasBeenCalled = true;
      await route.fulfill({
        status: 200,
      });
    });

    await page.getByRole('button', { name: 'Subscribe' }).click();

    expect(apiHasBeenCalled).toBe(true);
    await expect(
      page.getByText(
        'Thank you for subscribing! Please check your email to confirm.',
      ),
    ).toBeVisible();
  });
});
