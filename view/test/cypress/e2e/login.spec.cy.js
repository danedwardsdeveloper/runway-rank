describe('Log in test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('should display "Log in" text when user is not logged in', () => {
    cy.contains('Log in').should('be.visible');
  });

  it('should log in and confirm the existence of the session cookie and display its content', () => {
    cy.visit('http://localhost:8080/log-in');

    cy.get('input[name="email"]').type('name@email.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:8080/');
  });

  it('should display "Log out" text now the user is logged in', () => {
    cy.wait(5000);
    cy.contains('Log out').should('be.visible');
  });
});
