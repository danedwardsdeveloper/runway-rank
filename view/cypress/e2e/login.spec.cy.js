describe('Session Cookie Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/log-in');

    cy.get('input[name="email"]').type('name@email.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:8080/');
  });

  it('should confirm the existence of the session cookie and display its content', () => {
    cy.getCookies()
      .should('exist')
      .then((cookies) => {
        cy.log('All Cookies:', JSON.stringify(cookies));
        console.log('All Cookies:', cookies);

        const sessionCookie = cookies.find((cookie) => cookie.name === 'Session');
        if (sessionCookie) {
          const decodedValue = decodeURIComponent(sessionCookie.value);
          cy.log('Session Cookie:', decodedValue);
          console.log('Session Cookie:', decodedValue); // Logs to the browser's console

          const cookieContent = JSON.parse(decodedValue);
          cy.log('Parsed Cookie Content:', JSON.stringify(cookieContent));
          console.log('Parsed Cookie Content:', cookieContent); // Logs to the browser's console

          expect(cookieContent).to.have.property('userId', 14);
          expect(cookieContent).to.have.property('email', 'name@email.com');
          expect(cookieContent).to.have.property('firstName', 'Meghan');
        } else {
          throw new Error('Session cookie not found');
        }
      });
  });
});
