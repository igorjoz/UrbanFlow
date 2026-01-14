describe('Navigation Guards', () => {
  it('should redirect to login when accessing protected route without auth', () => {
    cy.visit('/dashboard')
    
    cy.url().should('include', '/login')
  })

  it('should redirect to login when accessing map without auth', () => {
    cy.visit('/map')
    
    cy.url().should('include', '/login')
  })

  it('should redirect to login when accessing stop details without auth', () => {
    cy.visit('/stop/1667')
    
    cy.url().should('include', '/login')
  })

  it('should redirect to dashboard when accessing login while authenticated', () => {
    cy.login()
    cy.visit('/login')
    
    cy.url().should('include', '/dashboard')
  })

  it('should redirect to dashboard when accessing register while authenticated', () => {
    cy.login()
    cy.visit('/register')
    
    cy.url().should('include', '/dashboard')
  })

  it('should preserve redirect query after login', () => {
    cy.visit('/stop/1667')
    
    // Should redirect to login with redirect query
    cy.url().should('include', '/login')
    cy.url().should('include', 'redirect')
    
    // After login, should go to original destination
    cy.get('input[type="email"]').type('test@urbanflow.pl')
    cy.get('input[type="password"]').type('Test123!')
    cy.get('button[type="submit"]').click()
    
    cy.url().should('include', '/stop/1667', { timeout: 15000 })
  })

  it('should show 404 page for unknown routes', () => {
    cy.visit('/unknown-route')
    
    cy.contains('404').should('be.visible')
    cy.contains('Strona nie została znaleziona').should('be.visible')
    cy.contains('Wróć do dashboardu').should('be.visible')
  })
})
