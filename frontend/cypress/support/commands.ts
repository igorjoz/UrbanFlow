/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      logout(): Chainable<void>
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

// Login command
Cypress.Commands.add('login', (email = 'test@urbanflow.pl', password = 'Test123!') => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard', { timeout: 15000 })
})

// Logout command
Cypress.Commands.add('logout', () => {
  cy.contains('button', 'Wyloguj').click()
  cy.url().should('include', '/login')
})

// Get by test ID helper
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

export {}
