describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('redirects unauthenticated users from protected route to signup', () => {
    cy.visit('/')
    cy.url().should('include', '/signup')
  })

  it('signs in with valid credentials and redirects to dashboard', () => {
    cy.login()
    cy.contains('User Management').should('be.visible')
    cy.contains('Hello, Emily').should('be.visible')
  })

  it('shows error message with invalid credentials', () => {
    cy.visit('/signin')
    cy.get('input[name="username"]').type('invaliduser')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Invalid credentials').should('be.visible')
  })

  it('signs out and redirects to signup', () => {
    cy.login()
    cy.contains('Sign out').click()
    cy.url().should('include', '/signup')
  })

  it('navigates between signin and signup pages', () => {
    cy.visit('/signin')
    cy.contains('Sign up').click()
    cy.url().should('include', '/signup')
    cy.contains('Sign in').click()
    cy.url().should('include', '/signin')
  })
})
