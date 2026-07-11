# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: capture-screenshots.test.ts >> Submission Screenshot Capture Suite >> Automated Success and Error States
- Location: scripts/capture-screenshots.test.ts:32:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByPlaceholder(/Amount/i)

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - generic [ref=e13]:
          - heading "StellarFund Live" [level=1] [ref=e14]
          - paragraph [ref=e15]: Crowdfunding on Soroban
      - generic [ref=e16]:
        - link "About" [ref=e17] [cursor=pointer]:
          - /url: "#about"
        - generic [ref=e18]: "|"
        - generic [ref=e19]: Stellar Testnet
  - main [ref=e21]:
    - generic [ref=e22]:
      - heading "Decentralized Crowdfunding, Settled in Real Time." [level=2] [ref=e23]:
        - text: Decentralized Crowdfunding,
        - text: Settled in Real Time.
      - paragraph [ref=e24]: StellarFund Live brings crowdfund projects to life using Soroban smart contracts. Connect your Freighter wallet, fund with Testnet XLM, and pledge to campaigns with total transparency.
    - generic [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]:
            - heading "Wallet Manager" [level=2] [ref=e29]:
              - img [ref=e30]
              - text: Wallet Manager
            - generic [ref=e33]: Testnet
          - generic [ref=e34]:
            - generic [ref=e35]:
              - generic [ref=e36]:
                - generic [ref=e37]: Account Address
                - generic [ref=e38]: GAHZFL...HUXJ2T
              - button "Copy Address" [ref=e39] [cursor=pointer]:
                - img [ref=e40]
            - button "Disconnect Wallet" [ref=e43] [cursor=pointer]:
              - img [ref=e44]
              - text: Disconnect Wallet
        - generic [ref=e47]:
          - generic [ref=e49]:
            - generic [ref=e50]:
              - img [ref=e51]
              - text: Native Balance
            - button "Refresh Balance" [ref=e56] [cursor=pointer]:
              - img [ref=e57]
          - generic [ref=e63]:
            - generic [ref=e64]: "10000.0000"
            - generic [ref=e65]: XLM
          - generic [ref=e66]:
            - generic [ref=e67]: "Asset Type: Native"
            - generic [ref=e68]: "Network: Horizon Testnet"
      - generic [ref=e69]:
        - generic [ref=e70]:
          - generic [ref=e73]:
            - generic [ref=e74]:
              - heading "RiseIn Dev Fund" [level=3] [ref=e75]
              - paragraph [ref=e76]: Help fund the next generation of Stellar developers.
            - generic [ref=e77]: Active
          - generic [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e80]:
                - img [ref=e81]
                - text: Goal
              - generic [ref=e85]: 5000 XLM
            - generic [ref=e86]:
              - generic [ref=e87]:
                - img [ref=e88]
                - text: Pledged
              - generic [ref=e93]: 2450 XLM
            - generic [ref=e94]:
              - generic [ref=e95]:
                - img [ref=e96]
                - text: Deadline
              - generic [ref=e99]: 13 Days
        - generic [ref=e100]:
          - generic [ref=e101]:
            - generic [ref=e102]:
              - heading "Back this Project" [level=3] [ref=e103]
              - generic [ref=e104]:
                - generic [ref=e105]: Pledge Amount (XLM)
                - generic [ref=e106]:
                  - spinbutton [ref=e107]
                  - generic [ref=e108]: XLM
              - button "Submit Pledge" [disabled] [ref=e109]:
                - img [ref=e110]
                - text: Submit Pledge
            - generic [ref=e113]:
              - heading "Send XLM Payment" [level=2] [ref=e114]:
                - img [ref=e115]
                - text: Send XLM Payment
              - generic [ref=e118]:
                - generic [ref=e119]:
                  - text: Destination Address
                  - textbox "G..." [ref=e120]
                - generic [ref=e121]:
                  - text: Amount (XLM)
                  - generic [ref=e122]:
                    - spinbutton [ref=e123]
                    - generic [ref=e124]: XLM
                - button "Send Payment" [ref=e125] [cursor=pointer]:
                  - img [ref=e126]
                  - text: Send Payment
          - generic [ref=e130]:
            - generic [ref=e131]:
              - img [ref=e132]
              - heading "Live Activity" [level=3] [ref=e134]
            - generic [ref=e135]:
              - generic [ref=e136]:
                - generic [ref=e137]: GA
                - generic [ref=e138]:
                  - paragraph [ref=e139]:
                    - generic [ref=e140]: GAX.....34B
                    - text: pledged
                    - generic [ref=e141]: 50 XLM
                  - paragraph [ref=e142]: 3:47:41 PM
              - generic [ref=e143]:
                - generic [ref=e144]: GB
                - generic [ref=e145]:
                  - paragraph [ref=e146]:
                    - generic [ref=e147]: GBY.....99Z
                    - text: pledged
                    - generic [ref=e148]: 150 XLM
                  - paragraph [ref=e149]: 1:52:41 PM
                  - paragraph [ref=e150]: Badge Awarded! 🏅
  - contentinfo [ref=e151]:
    - paragraph [ref=e152]:
      - text: Made for the RiseIn Stellar Journey to Mastery with
      - img [ref=e153]
    - paragraph [ref=e155]: © 2026 StellarFund Live. Built on Soroban. Testnet only.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { Keypair, TransactionBuilder, Networks } from '@stellar/stellar-sdk';
  3   | import fs from 'fs';
  4   | import path from 'path';
  5   | 
  6   | // Generate a random keypair for this test run
  7   | const testKeypair = Keypair.random();
  8   | const publicKey = testKeypair.publicKey();
  9   | const secret = testKeypair.secret();
  10  | 
  11  | // Helper to save screenshots with clear filenames
  12  | const screenshotDir = path.resolve(process.cwd(), '../docs/screenshots');
  13  | 
  14  | async function takeScreenshot(page, filename) {
  15  |   if (!fs.existsSync(screenshotDir)) {
  16  |     fs.mkdirSync(screenshotDir, { recursive: true });
  17  |   }
  18  |   await page.screenshot({ path: path.join(screenshotDir, filename) });
  19  | }
  20  | 
  21  | test.describe('Submission Screenshot Capture Suite', () => {
  22  |   
  23  |   test.beforeAll(async () => {
  24  |     console.log(`Pre-funding generated test keypair: ${publicKey}`);
  25  |     const res = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
  26  |     if (!res.ok) {
  27  |       throw new Error(`Friendbot funding failed for ${publicKey}`);
  28  |     }
  29  |     console.log('Funding complete!');
  30  |   });
  31  | 
  32  |   test('Automated Success and Error States', async ({ page }) => {
  33  |     // Log console and errors
  34  |     page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  35  |     page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  36  | 
  37  |     // 1. Expose the signing function so the browser can call it
  38  |     await page.exposeFunction('mockFreighterSignTransaction', (xdr: string) => {
  39  |       // Decode the XDR, sign it with our testnet keypair, and re-encode
  40  |       const tx = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
  41  |       tx.sign(testKeypair);
  42  |       return tx.toXDR();
  43  |     });
  44  | 
  45  |     // 2. Inject a mock Freighter extension into the window
  46  |     await page.addInitScript((pubKey) => {
  47  |       (window as any).freighter = {
  48  |         isConnected: () => true,
  49  |         isAllowed: async () => true,
  50  |         getPublicKey: async () => pubKey,
  51  |         signTransaction: async (xdr: string, opts: any) => {
  52  |           console.log('Mock Freighter intercepted signTransaction');
  53  |           // Call the Node.js context function we exposed above
  54  |           const signedXdr = await (window as any).mockFreighterSignTransaction(xdr);
  55  |           return { status: 'SUCCESS', signedXdr };
  56  |         }
  57  |       };
  58  |       
  59  |       // Also inject a flag we can check to ensure the simulation isn't running
  60  |       (window as any).__PLAYWRIGHT_E2E__ = true;
  61  |     }, publicKey);
  62  | 
  63  |     // 3. Navigate to the local app
  64  |     await page.goto('http://localhost:5173');
  65  | 
  66  |     // 4. Wait for it to load and assert we are running against real deployed contract
  67  |     // We expect the contract ID to be present and not mocked. We can check this by 
  68  |     // ensuring the UI doesn't show a "Simulation Mode" warning if we implemented one, 
  69  |     // or by checking window variables if exposed.
  70  |     
  71  |     // Connect Wallet State (01)
  72  |     await page.locator('text=Connect Freighter Wallet').click();
  73  |     
  74  | 
  75  | 
  76  |     // Verify Connected (01)
  77  |     await expect(page.locator('text=Account Address').first()).toBeVisible({ timeout: 15000 });
  78  |     await takeScreenshot(page, '01-wallet-connected.png');
  79  | 
  80  |     // Balance Displayed (02)
  81  |     // Wait for the balance to load from Horizon
  82  |     await expect(page.locator('text=XLM').first()).toBeVisible({ timeout: 15000 });
  83  |     await takeScreenshot(page, '02-balance-displayed.png');
  84  | 
  85  |     // Now let's do a Pledge (06)
  86  |     const pledgeInput = page.getByPlaceholder(/Amount/i);
> 87  |     await pledgeInput.fill('50');
      |                       ^ Error: locator.fill: Test timeout of 60000ms exceeded.
  88  |     
  89  |     await takeScreenshot(page, '06-pledge-flow.png');
  90  |     
  91  |     const pledgeButton = page.locator('text=Pledge').first();
  92  |     await pledgeButton.click();
  93  | 
  94  |     // TX Pending (04)
  95  |     await expect(page.locator('text=Sending to testnet').first()).toBeVisible({ timeout: 10000 });
  96  |     await takeScreenshot(page, '04-tx-pending.png');
  97  | 
  98  |     // TX Success (05)
  99  |     await expect(page.locator('text=Hash:').first()).toBeVisible({ timeout: 45000 });
  100 |     await takeScreenshot(page, '05-tx-success.png');
  101 | 
  102 |     // Mobile Responsive (09)
  103 |     await page.setViewportSize({ width: 375, height: 667 });
  104 |     await takeScreenshot(page, '09-mobile-responsive.png');
  105 | 
  106 |     // Note: To fully automate 07, 08 (live event, badge), we need the 
  107 |     // activity feed and the goal to be reached. This might require pledging 
  108 |     // the remaining goal amount.
  109 |     console.log('Automated success path complete. Some error state screenshots are mocked manually.');
  110 |   });
  111 | });
  112 | 
```