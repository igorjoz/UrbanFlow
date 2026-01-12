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
      cy.get('input[type="password"]').type('WrongPass123')
      cy.get('button[type="submit"]').click()
      
      cy.contains('Nieprawidłowy email lub hasło').should('be.visible')
    })

    it('should login successfully with valid credentials', () => {
      cy.get('input[type="email"]').type('testuser@example.com')
      cy.get('input[type="password"]').type('Test123!')
      cy.get('button[type="submit"]').click()
      
      cy.url().should('include', '/dashboard')
      cy.contains('Dashboard').should('be.visible')
    })

    it('should show validation error for empty fields', () => {
      cy.get('button[type="submit"]').click()
      
      cy.contains('Wypełnij wszystkie pola').should('be.visible')
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
