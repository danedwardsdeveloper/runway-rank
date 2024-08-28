import { afterAll, beforeAll } from 'vitest';
import { launch } from 'puppeteer';
import type { Browser, Page } from 'puppeteer';

let browser: Browser;
let page: Page;

beforeAll(async () => {
	browser = await launch();
	page = await browser.newPage();

	const client = await page.target().createCDPSession();
	const cookies = await client.send('Network.getAllCookies');

	const deletedCookies = [];
	for (const cookie of cookies.cookies) {
		await client.send('Network.deleteCookies', {
			name: cookie.name,
			domain: cookie.domain,
		});
		deletedCookies.push(cookie.name);
	}

	if (deletedCookies.length > 0) {
		console.log(`Deleted cookies: ${deletedCookies.join(', ')}`);
	} else {
		console.log('No cookies were deleted');
	}
});

afterAll(async () => {
	await browser.close();
});

export { browser, page };
