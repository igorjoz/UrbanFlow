describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  describe('Login', () => {
    it('should display login form', () => {
      cy.contains('h3', 'Zaloguj się').should('be.visible')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('contain', 'Zaloguj się')
    })

    it('should show error for invalid credentials', () => {
      cy.get('input[type="email"]').type('wrong@example.com')
      cy.get('input[type="password"]').type('WrongPass123!')
      cy.get('button[type="submit"]').click()
      
      cy.contains('Invalid email or password').should('be.visible')
    })

    it('should login successfully with valid credentials', () => {
      cy.clearLocalStorage()
      cy.get('input[type="email"]').type('test@urbanflow.pl')
      cy.get('input[type="password"]').type('Test123!')
      cy.get('button[type="submit"]').click()
      
      cy.url().should('include', '/dashboard', { timeout: 15000 })
      cy.contains('Dashboard').should('be.visible')
    })

    it('should show validation error for empty fields', () => {
      // Try to submit with only email filled
      cy.get('input[type="email"]').type('test@test.pl')
      cy.get('input[type="email"]').clear()
      cy.get('button[type="submit"]').click()
      
      // The form should not navigate - stays on login
      cy.url().should('include', '/login')
    })

    it('should have link to registration page', () => {
      cy.contains('a', 'Zarejestruj się').click()
      
      cy.url().should('include', '/register')
    })
  })

  describe('Logout', () => {
    it('should logout successfully', () => {
      cy.login()
      
      cy.contains('button', 'Wyloguj').click()
      
      cy.url().should('include', '/login')
      cy.window().its('localStorage.token').should('be.undefined')
    })
  })
})
