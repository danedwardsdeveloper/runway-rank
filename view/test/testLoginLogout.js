const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');
const assert = require('assert');

describe('Login and Logout Tests', function () {
	let driver;
	this.timeout(30000);

	const loginUrl = 'http://localhost:8080/log-in';
	const homeUrl = 'http://localhost:8080/';
	const logOutUrl = 'http://localhost:8080/log-out';
	const incorrectEmail = 'email@fake.com';
	const incorrectPassword = 'password';
	const email = 'name@email.com';
	const password = 'password123';

	before(async function () {
		let options = new chrome.Options();
		// options.addArguments('headless');
		options.addArguments('disable-gpu');
		options.addArguments('no-sandbox');
		options.addArguments('disable-dev-shm-usage');

		driver = await new Builder()
			.forBrowser('chrome')
			.setChromeOptions(options)
			.build();

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
		await driver.get(loginUrl);
		await driver.findElement(By.id('email'));
		await driver.findElement(By.id('password'));
	});

	it('should not change the URL when the wrong credentials are used to log in', async function () {
		await driver.findElement(By.id('email')).sendKeys(incorrectEmail);
		await driver.findElement(By.id('password')).sendKeys(incorrectPassword);
		await driver.findElement(By.css('button[type="submit"]')).click();

		const currentUrl = await driver.wait(until.urlIs(loginUrl), 5000);
		console.log(`Current URL: ${currentUrl}`);

		assert.strictEqual(
			currentUrl,
			loginUrl,
			'The URL should not change when the login is unsuccessful'
		);
	});

	it('should display an error message when the wrong credentials are used to log in', async function () {
		const errorMessage = await driver.findElement(By.css('.error-message'));
		assert(errorMessage, 'Error message element not found');
	});

	it('should log in successfully', async function () {
		const emailField = await driver.findElement(By.id('email'));
		const passwordField = await driver.findElement(By.id('password'));

		await emailField.clear();
		await emailField.sendKeys(email);

		await passwordField.clear();
		await passwordField.sendKeys(password);

		await driver.findElement(By.css('button[type="submit"]')).click();

		const linkText = 'Log out';

		const logoutLink = await driver.wait(
			until.elementLocated(By.xpath(`//a[text()='${linkText}']`)),
			10000,
			`"${linkText}" link not found`
		);
		await driver.wait(until.elementIsVisible(logoutLink), 10000);

		assert(logoutLink, `"${linkText}" link not found`);
	});

	it('should log out successfully', async function () {
		await driver.get(logOutUrl);

		const logoutLink = await driver.wait(
			until.elementLocated(By.xpath("//a[text()='Log out']")),
			10000
		);
		await driver.wait(until.elementIsVisible(logoutLink), 10000);
		await logoutLink.click();

		const alert = await driver.wait(until.alertIsPresent(), 10000);
		await alert.accept();

		const currentUrl = await driver.wait(until.urlIs(loginUrl), 5000);
		assert.strictEqual(currentUrl, loginUrl, 'Logout was not successful');
	});
});
