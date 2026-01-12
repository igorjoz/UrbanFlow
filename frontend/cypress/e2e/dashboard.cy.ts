describe('Dashboard', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display dashboard after login', () => {
    cy.contains('h1', 'Dashboard').should('be.visible')
    cy.contains('Twoje zapisane przystanki').should('be.visible')
  })

  it('should display navigation bar with user info', () => {
    cy.contains('UrbanFlow').should('be.visible')
    cy.contains('Dashboard').should('be.visible')
    cy.contains('Mapa').should('be.visible')
    cy.contains('Witaj').should('be.visible')
    cy.contains('button', 'Wyloguj').should('be.visible')
  })

  it('should display add stop form', () => {
    cy.contains('Dodaj przystanek').should('be.visible')
    cy.get('input[placeholder*="Wyszukaj"]').should('be.visible')
  })

  it('should search for stops', () => {
    cy.get('input[placeholder*="Wyszukaj"]').type('Dworzec')
    
    // Wait for search results
    cy.contains('Dworzec', { timeout: 5000 }).should('be.visible')
  })

  it('should show user stops if any exist', () => {
    // The test user has some stops seeded
    cy.get('.bg-gradient-to-r').should('exist') // Stop cards have gradient headers
  })

  it('should navigate to map view', () => {
    cy.contains('a', 'Mapa').click()
    
    cy.url().should('include', '/map')
    cy.contains('Mapa przystanków').should('be.visible')
  })
})
