describe('Stop Details', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should navigate to stop details from dashboard', () => {
    // Wait for stops to load
    cy.get('[class*="bg-gradient-to-r"]', { timeout: 10000 }).should('exist')
    
    // Click on the stop card header to expand it
    cy.get('[class*="bg-gradient-to-r"]').first().click()
    
    // Now click on the details link
    cy.get('a[href*="/stop/"]').first().click()
    
    cy.url().should('match', /\/stop\/\d+/)
    cy.contains('Najbliższe odjazdy').should('be.visible')
  })

  it('should display stop information', () => {
    cy.visit('/stop/1667') // Miszewskiego stop
    
    cy.contains('ID:').should('be.visible')
    cy.contains('Lokalizacja').should('be.visible')
    cy.contains('Najbliższe odjazdy').should('be.visible')
  })

  it('should show delay table', () => {
    cy.visit('/stop/1667')
    
    cy.get('table').should('be.visible')
    cy.contains('th', 'Linia').should('be.visible')
    cy.contains('th', 'Kierunek').should('be.visible')
    cy.contains('th', 'Opóźnienie').should('be.visible')
  })

  it('should have back button', () => {
    cy.visit('/stop/1667')
    
    cy.contains('Wróć').should('be.visible')
    cy.contains('Wróć').click()
    
    cy.url().should('not.include', '/stop/')
  })

  it('should allow adding/removing stop from details page', () => {
    cy.visit('/stop/1667')
    
    // Toggle button should exist
    cy.get('button').contains(/Dodaj do listy|Na liście/).should('be.visible')
  })
})
