describe('Map View', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/map')
  })

  it('should display map', () => {
    cy.contains('Mapa przystanków').should('be.visible')
    
    // Leaflet map should be present
    cy.get('.leaflet-container').should('be.visible')
  })

  it('should show legend', () => {
    cy.contains('Legenda').should('be.visible')
    cy.contains('Przystanek').should('be.visible')
    cy.contains('Twój przystanek').should('be.visible')
  })

  it('should show zoom controls', () => {
    cy.get('.leaflet-control-zoom').should('be.visible')
    cy.get('.leaflet-control-zoom-in').should('be.visible')
    cy.get('.leaflet-control-zoom-out').should('be.visible')
  })

  it('should show OpenStreetMap attribution', () => {
    cy.get('.leaflet-control-attribution').should('contain', 'OpenStreetMap')
  })

  it('should zoom in and out', () => {
    cy.get('.leaflet-control-zoom-in').click()
    cy.wait(500)
    cy.get('.leaflet-control-zoom-out').click()
  })
})
