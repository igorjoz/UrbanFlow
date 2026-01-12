/// <reference types="cypress" />

import './commands'

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test
  return false
})

// Clear localStorage before each test
beforeEach(() => {
  cy.window().then((win) => {
    win.localStorage.clear()
  })
})
