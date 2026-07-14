import { test, expect } from '@playwright/test';
import * as path from 'path';

test('capture wallet options modal', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Click connect to open modal
  await page.click('text="Connect Wallet"');
  
  // Wait for the modal to be visible.
  await page.waitForSelector('text="Freighter"');
  
  // Wait a moment for animations
  await page.waitForTimeout(500);
  
  // Capture screenshot
  await page.screenshot({ path: path.join(__dirname, '../../assets/wallet-options-modal.png') });
});
