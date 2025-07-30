describe('Quiz Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the quiz homepage', () => {
    cy.contains('Lead Generation Quiz Template').should('be.visible');
    cy.get('img[alt="Logo"]').should('be.visible');
  });

  it('should navigate through quiz questions', () => {
    // Answer first question
    cy.contains('What is your business stage?').should('be.visible');
    cy.contains('Growing').click();
    cy.contains('Next').click();

    // Answer second question
    cy.contains('What are your main challenges?').should('be.visible');
    cy.contains('Lead Generation').click();
    cy.contains('Customer Retention').click();
    cy.contains('Next').click();

    // Answer third question
    cy.contains('What is your monthly marketing budget?').should('be.visible');
    cy.get('input[placeholder*="5,000"]').type('10000');
    cy.contains('Next').click();

    // Fill email form
    cy.contains('Get Your Personalized Results').should('be.visible');
    cy.get('input[placeholder="Your Name"]').type('John Doe');
    cy.get('input[placeholder="Your Email"]').type('john@example.com');
    cy.contains('Get Results').click();

    // Check results page
    cy.contains('Thank You, John Doe!').should('be.visible');
    cy.contains('john@example.com').should('be.visible');
  });

  it('should validate required fields', () => {
    // Try to proceed without selecting an option
    cy.contains('Next').should('be.disabled');
    
    // Select an option
    cy.contains('Startup').click();
    cy.contains('Next').should('not.be.disabled');
  });

  it('should show progress bar', () => {
    cy.get('[role="progressbar"]').should('be.visible');
    cy.contains('Step 1 of 4').should('be.visible');
  });

  it('should handle email validation', () => {
    // Navigate to email form
    cy.contains('Startup').click();
    cy.contains('Next').click();
    cy.contains('Lead Generation').click();
    cy.contains('Next').click();
    cy.get('input[placeholder*="5,000"]').type('5000');
    cy.contains('Next').click();

    // Try invalid email
    cy.get('input[placeholder="Your Email"]').type('invalid-email');
    cy.get('input[placeholder="Your Name"]').type('Test User');
    cy.contains('Get Results').click();
    
    // Should show validation error or not submit
    cy.url().should('not.include', '/results');
  });
});