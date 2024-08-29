import { describe, it, expect } from 'vitest';
import { page } from './setup';
import { getByTestId } from './utilities';

const baseUrl = 'http://localhost:5173';

describe('Home Page', () => {
	it('should have the correct title', async () => {
		await page.goto(baseUrl);
		const title = await page.title();
		expect(title).toContain('Runway Rank');
	});

	it('should display two runway images with cursor not-allowed', async () => {
		await page.goto(baseUrl);

		const firstRunwayImage = await getByTestId(page, 'runway-image');
		expect(firstRunwayImage).not.toBeNull();

		const runwayImages = await page.$$('[data-testid="runway-image"]');
		expect(runwayImages.length).toBe(2);

		for (const image of runwayImages) {
			const isVisible = await image.isVisible();
			expect(isVisible).toBe(true);

			const cursorStyle = await image.evaluate((el) =>
				window.getComputedStyle(el).getPropertyValue('cursor')
			);
			expect(cursorStyle).toBe('not-allowed');
		}
	});

	it('should display a banner prompting you to sign in or create an account', async () => {
		await page.goto(baseUrl);
		const banner = await getByTestId(page, 'banner');
		expect(banner).not.toBeNull();
	});

	it('should display the profile menu button', async () => {
		await page.goto(baseUrl);
		const profileMenuButton = await getByTestId(page, 'profile-menu-button');
		expect(profileMenuButton).not.toBeNull();

		if (profileMenuButton) {
			const isVisible = await profileMenuButton.isVisible();
			expect(isVisible).toBe(true);
		}
	});

	it('should display both sign-in and create-account links when menu is opened', async () => {
		await page.goto(baseUrl);
		const profileMenuButton = await getByTestId(page, 'profile-menu-button');
		expect(profileMenuButton).not.toBeNull();

		if (profileMenuButton) {
			await profileMenuButton.click();

			const signInLink = await getByTestId(page, '/sign-in');
			const createAccountLink = await getByTestId(page, '/create-account');

			expect(signInLink).not.toBeNull();
			expect(createAccountLink).not.toBeNull();

			if (signInLink && createAccountLink) {
				const signInLinkVisible = await signInLink.isVisible();
				const createAccountLinkVisible =
					await createAccountLink.isVisible();

				expect(signInLinkVisible).toBe(true);
				expect(createAccountLinkVisible).toBe(true);
			}
		}
	});

	it('should make an account', async () => {
		await page.goto(`${baseUrl}/create-account`);

		const nameInput = await getByTestId(page, 'create-account-name-input');
		const emailInput = await getByTestId(page, 'create-account-email-input');
		const passwordInput = await getByTestId(
			page,
			'create-account-password-input'
		);
		const submitButton = await getByTestId(
			page,
			'create-account-submit-button'
		);

		expect(nameInput).not.toBeNull();
		expect(emailInput).not.toBeNull();
		expect(passwordInput).not.toBeNull();
		expect(submitButton).not.toBeNull();

		await nameInput?.type('Test User');
		await emailInput?.type('testuser@example.com');
		await passwordInput?.type('SecurePassword123!');

		await submitButton?.click();
		const errorMessage = await getByTestId(
			page,
			'create-account-error-message'
		);
		expect(errorMessage).toBeNull();
	});

	it('should should have sign out in the menu', async () => {
		const profileMenuButton = await getByTestId(page, 'profile-menu-button');
		expect(profileMenuButton).not.toBeNull();

		if (profileMenuButton) {
			const isVisible = await profileMenuButton.isVisible();
			expect(isVisible).toBe(true);
		}
	});

			const signInLink = await getByTestId(page, '/sign-in');
			const createAccountLink = await getByTestId(page, '/create-account');

			expect(signInLink).not.toBeNull();
			expect(createAccountLink).not.toBeNull();

			if (signInLink && createAccountLink) {
				const signInLinkVisible = await signInLink.isVisible();
				const createAccountLinkVisible =
					await createAccountLink.isVisible();

				expect(signInLinkVisible).toBe(true);
				expect(createAccountLinkVisible).toBe(true);
			}
		}
	});

	it('should delete the account', async () => {
		await page.goto(`${baseUrl}/delete-account`);
		const deleteButton = await getByTestId(
			page,
			'delete-account-submit-button'
		);
		expect(deleteButton).not.toBeNull();

		await deleteButton?.click();
		const errorMessage = await getByTestId(
			page,
			'delete-account-error-message'
		);
		expect(errorMessage).toBeNull();
	});
});
