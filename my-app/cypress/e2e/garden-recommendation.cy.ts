describe('Garden Recommendation Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('completes the garden recommendation process', () => {
    // Fill out the form
    cy.get('input[name="latitude"]').type('37.7749')
    cy.get('input[name="longitude"]').type('-122.4194')
    cy.get('textarea[name="style_preferences"]').type('Modern and minimalist')

    // Upload an image
    cy.get('input[type="file"]').attachFile('test-garden.jpg')

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Wait for the analysis to complete
    cy.get('[data-testid="loading-indicator"]').should('exist')
    cy.get('[data-testid="loading-indicator"]').should('not.exist')

    // Verify the results
    cy.get('[data-testid="garden-analysis"]').should('be.visible')
    cy.get('[data-testid="plant-recommendations"]').should('be.visible')
    cy.get('[data-testid="garden-image"]').should('be.visible')
  })

  it('handles form validation', () => {
    // Try to submit without filling required fields
    cy.get('button[type="submit"]').click()

    // Check for validation messages
    cy.get('[data-testid="latitude-error"]').should('be.visible')
    cy.get('[data-testid="longitude-error"]').should('be.visible')
  })

  it('handles image upload validation', () => {
    // Try to upload an invalid file
    cy.get('input[type="file"]').attachFile('invalid.txt')

    // Check for error message
    cy.get('[data-testid="image-error"]').should('be.visible')
  })

  it('allows user to modify recommendations', () => {
    // Complete the initial form
    cy.get('input[name="latitude"]').type('37.7749')
    cy.get('input[name="longitude"]').type('-122.4194')
    cy.get('textarea[name="style_preferences"]').type('Modern and minimalist')
    cy.get('input[type="file"]').attachFile('test-garden.jpg')
    cy.get('button[type="submit"]').click()

    // Wait for results
    cy.get('[data-testid="loading-indicator"]').should('not.exist')

    // Modify preferences
    cy.get('[data-testid="modify-preferences"]').click()
    cy.get('textarea[name="style_preferences"]').clear().type('Traditional and cozy')
    cy.get('button[type="submit"]').click()

    // Verify updated results
    cy.get('[data-testid="garden-analysis"]').should('be.visible')
    cy.get('[data-testid="plant-recommendations"]').should('be.visible')
  })
}) 