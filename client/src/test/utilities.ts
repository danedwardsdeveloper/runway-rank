import type { Page } from 'puppeteer';

export async function getByTestId(page: Page, testId: string) {
	return page.$(`[data-testid="${testId}"]`);
}
