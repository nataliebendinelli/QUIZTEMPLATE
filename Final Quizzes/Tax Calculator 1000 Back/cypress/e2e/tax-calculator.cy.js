describe('Tax Calculator Quiz', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes the quiz flow successfully', () => {
    // Welcome screen
    cy.contains('Find $10,000+ in payroll tax credits').should('be.visible');
    cy.contains('button', 'Start 4-Minute Quiz').click();

    // Step 1: Hiring volume
    cy.contains('How many people have you hired').should('be.visible');
    cy.get('input[type="number"]').type('10');
    cy.contains('button', 'Continue').click();

    // Step 2: Business profile
    cy.contains('Tell us about your business').should('be.visible');
    cy.get('[role="combobox"]').click();
    cy.contains('California').click();
    cy.get('input[placeholder="12345"]').type('60612');
    cy.contains('button', 'Yes').click();
    cy.get('input[placeholder="$5,000"]').type('50000');
    cy.contains('button', 'Continue').click();

    // Step 3: Hire categories
    cy.contains('Did you hire anyone from these groups').should('be.visible');
    cy.contains('Military Veterans').click();
    cy.contains('People receiving food stamps').click();
    cy.contains('button', 'Calculate My Credits').click();

    // Results
    cy.contains('Your Business Could Save').should('be.visible');
    cy.contains('in Annual Tax Credits').should('be.visible');
    
    // Lead form
    cy.get('input[placeholder="Your Name"]').type('John Doe');
    cy.get('input[placeholder="Email Address"]').type('john@example.com');
    cy.get('input[placeholder="Phone Number"]').type('5551234567');
    cy.contains('button', 'Claim Your 90-Day Guarantee').click();

    // Breakdown should appear
    cy.contains('Your Tax Credit Breakdown').should('be.visible');
    cy.contains('WOTC Credit').should('be.visible');
  });

  it('validates form inputs correctly', () => {
    cy.contains('button', 'Start 4-Minute Quiz').click();

    // Try to continue without entering hires
    cy.contains('button', 'Continue').click();
    cy.contains('Please enter the number of people hired').should('be.visible');

    // Enter invalid number
    cy.get('input[type="number"]').type('0');
    cy.contains('button', 'Continue').click();
    cy.contains('Please enter the number of people hired').should('be.visible');
  });

  it('shows exit intent modal on mouse leave', () => {
    cy.contains('button', 'Start 4-Minute Quiz').click();
    
    // Trigger mouseleave event
    cy.get('body').trigger('mouseleave', { clientY: -1 });
    
    cy.contains('Don\'t leave empty-handed').should('be.visible');
    cy.contains('Download Free Cheat Sheet').should('be.visible');
  });

  it('handles mobile viewport correctly', () => {
    cy.viewport('iphone-x');
    
    cy.contains('Find $10,000+ in payroll tax credits').should('be.visible');
    cy.contains('button', 'Start 4-Minute Quiz').should('be.visible');
    
    // Check that mobile-specific elements work
    cy.contains('button', 'Start 4-Minute Quiz').click();
    cy.get('[role="slider"]').should('be.visible'); // Slider should be visible on mobile
  });
});