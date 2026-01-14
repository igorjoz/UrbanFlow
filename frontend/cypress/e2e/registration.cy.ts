describe('Registration', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('should display registration form', () => {
    cy.contains('h3', 'Utwórz konto').should('be.visible')
    cy.get('input[type="text"]').should('be.visible') // username
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('have.length', 2) // password + confirm
    cy.get('button[type="submit"]').should('contain', 'Zarejestruj się')
  })

  it('should show password requirements', () => {
    cy.contains('Minimum 8 znaków').should('be.visible')
    cy.contains('Wielka litera').should('be.visible')
    cy.contains('Mała litera').should('be.visible')
    cy.contains('Cyfra').should('be.visible')
  })

  it('should update password requirement indicators as user types', () => {
    cy.get('input[type="password"]').first().type('test')
    
    // Length requirement not met (should not have green class)
    cy.contains('li', 'Minimum 8 znaków').should('not.have.class', 'text-green-600')
    
    cy.get('input[type="password"]').first().clear().type('TestPass1')
    
    // All requirements met - check for green color class
    cy.contains('li', 'Minimum 8 znaków').should('satisfy', ($el) => {
      return $el.hasClass('text-green-600') || $el.attr('class')?.includes('text-green')
    })
    cy.contains('li', 'Wielka litera').should('satisfy', ($el) => {
      return $el.hasClass('text-green-600') || $el.attr('class')?.includes('text-green')
    })
  })

  it('should show error when passwords do not match', () => {
    cy.get('input[type="text"]').type('newuser')
    cy.get('input[type="email"]').type('newuser@example.com')
    cy.get('input[type="password"]').first().type('Test123!')
    cy.get('input[type="password"]').last().type('Different1!')
    
    cy.get('button[type="submit"]').click()
    
    cy.contains('Hasła nie są identyczne').should('be.visible')
  })

  it('should show error for weak password', () => {
    cy.get('input[type="text"]').type('newuser')
    cy.get('input[type="email"]').type('newuser@example.com')
    cy.get('input[type="password"]').first().type('weak')
    cy.get('input[type="password"]').last().type('weak')
    
    cy.get('button[type="submit"]').click()
    
    cy.contains('Hasło musi mieć minimum 8 znaków').should('be.visible')
  })

  it('should have link to login page', () => {
    cy.contains('a', 'Zaloguj się').click()
    
    cy.url().should('include', '/login')
  })
})
