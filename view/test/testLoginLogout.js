const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const assert = require('assert');

describe('Login and Logout Tests', function () {
	let driver;
	this.timeout(30000);

	before(async function () {
		driver = await new Builder().forBrowser('chrome').build();

		const homeUrl = 'http://localhost:8080/';
		await driver.get(homeUrl);
		await driver.manage().deleteAllCookies();
	});

	after(async function () {
		await driver.quit();
	});

	it('should display a link that says "Create an account"', async function () {
		const linkText = 'Create an account';
		const link = await driver.findElement(By.linkText(linkText));
		assert(link, `Link with text "${linkText}" not found`);
	});

	it('should display two disabled buttons that contain images', async function () {
		const buttons = await driver.findElements(By.css('button[disabled]'));

		assert.strictEqual(
			buttons.length,
			2,
			'There are not exactly two disabled buttons'
		);

		for (let button of buttons) {
			const img = await button.findElement(By.css('img'));
			const imgSrc = await img.getAttribute('src');

			assert(img, 'Button does not contain an image');
			assert(imgSrc, 'Image src attribute is empty');

			const naturalWidth = await img.getAttribute('naturalWidth');
			const naturalHeight = await img.getAttribute('naturalHeight');
			assert(naturalWidth > 0 && naturalHeight > 0, 'Image failed to load');
		}
	});

	it('should display a "Log in" button in the menu', async function () {
		const linkText = 'Log in';
		const link = await driver.findElement(By.linkText(linkText));
		assert(link, `Link with text "${linkText}" not found`);
	});

	it('should display email and password inputs on the login page', async function () {
		const loginUrl = 'http://localhost:8080/log-in';
		await driver.get(loginUrl);

		await driver.findElement(By.id('email'));
		await driver.findElement(By.id('password'));
	});

	it('should display an error when the wrong credentials are used to log in', async function () {
		const incorrectEmail = 'smalldickenergy@getalife.com';
		await driver.findElement(By.id('email')).sendKeys(incorrectEmail);

		const incorrectPassword = '$ecurEp@$sword';
		await driver.findElement(By.id('password')).sendKeys(incorrectPassword);

		await driver.findElement(By.css('button[type="submit"]')).click();
		await driver.wait(until.urlIs(loginUrl), 5000);

		const currentUrl = await driver.getCurrentUrl();
		assert.strictEqual(
			currentUrl,
			loginUrl,
			'The URL should not change when the login is unsuccessful'
		);

		// const errorMessage = await driver
		// 	.findElement(By.css('.error-message'))
		// 	.getText();
		// assert(
		// 	errorMessage.includes('Invalid credentials'),
		// 	'Error message not found or incorrect'
		// );
	});

	it('should log in successfully', async function () {
		// Click the "Log in" button

		const email = 'name@email.com';
		const password = 'password123';

		const loginButton = await driver.findElement(
			By.xpath("//button[text()='Log in']")
		);
		await loginButton.click();

		// Wait for the login page to load
		await driver.wait(until.urlIs(loginUrl), 5000);

		// Find the email and password input fields and enter the credentials
		await driver.findElement(By.name('email')).sendKeys(email);
		await driver.findElement(By.name('password')).sendKeys(password);

		// Find the login button and click it
		await driver.findElement(By.css('button[type="submit"]')).click();

		// Wait for the login to complete
		await driver.wait(until.urlIs(homeUrl), 5000);

		// Verify login by checking the current URL
		const currentUrl = await driver.getCurrentUrl();
		assert.strictEqual(currentUrl, homeUrl, 'Login was not successful');
	});

	it('should log out successfully', async function () {
		// Assuming you are already logged in from the previous test

		// Find the logout button/link and click it
		const logoutButton = await driver.findElement(By.name('logout'));
		await logoutButton.click();

		// Wait for the logout to complete
		await driver.wait(until.urlIs(loginUrl), 5000);

		// Verify logout by checking the current URL
		const currentUrl = await driver.getCurrentUrl();
		assert.strictEqual(currentUrl, loginUrl, 'Logout was not successful');
	});
});
