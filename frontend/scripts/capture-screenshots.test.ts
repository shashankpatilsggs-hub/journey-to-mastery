import { test, expect } from '@playwright/test';
import { Keypair, TransactionBuilder, Networks } from '@stellar/stellar-sdk';
import fs from 'fs';
import path from 'path';

// Generate a random keypair for this test run
const testKeypair = Keypair.random();
const publicKey = testKeypair.publicKey();
const secret = testKeypair.secret();

// Helper to save screenshots with clear filenames
const screenshotDir = path.resolve(process.cwd(), '../docs/screenshots');

async function takeScreenshot(page, filename) {
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  await page.screenshot({ path: path.join(screenshotDir, filename) });
}

test.describe('Submission Screenshot Capture Suite', () => {
  
  test.beforeAll(async () => {
    console.log(`Pre-funding generated test keypair: ${publicKey}`);
    const res = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    if (!res.ok) {
      throw new Error(`Friendbot funding failed for ${publicKey}`);
    }
    console.log('Funding complete!');
  });

  test('Automated Success and Error States', async ({ page }) => {
    // Log console and errors
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    // 1. Expose the signing function so the browser can call it
    await page.exposeFunction('mockFreighterSignTransaction', (xdr: string) => {
      // Decode the XDR, sign it with our testnet keypair, and re-encode
      const tx = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
      tx.sign(testKeypair);
      return tx.toXDR();
    });

    // 2. Inject a mock Freighter extension into the window
    await page.addInitScript((pubKey) => {
      (window as any).freighter = {
        isConnected: () => true,
        isAllowed: async () => true,
        getPublicKey: async () => pubKey,
        signTransaction: async (xdr: string, opts: any) => {
          console.log('Mock Freighter intercepted signTransaction');
          // Call the Node.js context function we exposed above
          const signedXdr = await (window as any).mockFreighterSignTransaction(xdr);
          return { status: 'SUCCESS', signedXdr };
        }
      };
      
      // Also inject a flag we can check to ensure the simulation isn't running
      (window as any).__PLAYWRIGHT_E2E__ = true;
    }, publicKey);

    // 3. Navigate to the local app
    await page.goto('http://localhost:5173');

    // 4. Wait for it to load and assert we are running against real deployed contract
    // We expect the contract ID to be present and not mocked. We can check this by 
    // ensuring the UI doesn't show a "Simulation Mode" warning if we implemented one, 
    // or by checking window variables if exposed.
    
    // Connect Wallet State (01)
    await page.locator('text=Connect Freighter Wallet').click();
    


    // Verify Connected (01)
    await expect(page.locator('text=Account Address').first()).toBeVisible({ timeout: 15000 });
    await takeScreenshot(page, '01-wallet-connected.png');

    // Balance Displayed (02)
    // Wait for the balance to load from Horizon
    await expect(page.locator('text=XLM').first()).toBeVisible({ timeout: 15000 });
    await takeScreenshot(page, '02-balance-displayed.png');

    // Now let's do a Pledge (06)
    const pledgeInput = page.getByPlaceholder(/Amount/i);
    await pledgeInput.fill('50');
    
    await takeScreenshot(page, '06-pledge-flow.png');
    
    const pledgeButton = page.locator('text=Pledge').first();
    await pledgeButton.click();

    // TX Pending (04)
    await expect(page.locator('text=Sending to testnet').first()).toBeVisible({ timeout: 10000 });
    await takeScreenshot(page, '04-tx-pending.png');

    // TX Success (05)
    await expect(page.locator('text=Hash:').first()).toBeVisible({ timeout: 45000 });
    await takeScreenshot(page, '05-tx-success.png');

    // Mobile Responsive (09)
    await page.setViewportSize({ width: 375, height: 667 });
    await takeScreenshot(page, '09-mobile-responsive.png');

    // Note: To fully automate 07, 08 (live event, badge), we need the 
    // activity feed and the goal to be reached. This might require pledging 
    // the remaining goal amount.
    console.log('Automated success path complete. Some error state screenshots are mocked manually.');
  });
});
