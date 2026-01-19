/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (username = 'emilys', password = 'emilyspass') => {
  cy.visit('/signin')
  cy.get('input[name="username"]').type(username)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('eq', Cypress.config().baseUrl + '/')
})

export {}
