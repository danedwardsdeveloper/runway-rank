describe('Log in test', () => {
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
        const sessionCookie = cookies.find((cookie) => cookie.name === 'Session');
        if (sessionCookie) {
          const decodedValue = decodeURIComponent(sessionCookie.value);

          const cookieContent = JSON.parse(decodedValue);

          expect(cookieContent).to.have.property('userId', 14);
          expect(cookieContent).to.have.property('email', 'name@email.com');
          expect(cookieContent).to.have.property('firstName', 'Meghan');
        } else {
          throw new Error('Session cookie not found');
        }
      });
  });
});
