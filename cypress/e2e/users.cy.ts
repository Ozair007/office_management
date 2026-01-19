describe('User Management', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.login()
  })

  it('displays user list on dashboard', () => {
    cy.contains('Users').should('be.visible')
    cy.get('table').should('be.visible')
    cy.get('table tbody tr').should('have.length.at.least', 1)
  })

  it('adds a new user', () => {
    cy.contains('Add User').click()
    cy.contains('Create User').should('be.visible')

    cy.get('input[name="firstName"]').type('Test')
    cy.get('input[name="lastName"]').type('User')
    cy.get('input[name="username"]').type('testuser123')
    cy.get('input[name="email"]').type('testuser@example.com')

    cy.contains('button', 'Create').click()

    cy.contains('Test User').should('be.visible')
  })

  it('edits an existing user', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').first().click()
    })

    cy.contains('Edit User').should('be.visible')

    cy.get('input[name="firstName"]').clear().type('Updated')
    cy.get('input[name="lastName"]').clear().type('Name')

    cy.contains('button', 'Save Changes').click()

    cy.contains('Updated Name').should('be.visible')
  })

  it('deletes a user', () => {
    cy.get('table tbody tr').first().find('td').eq(1).invoke('text').then((userName) => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').last().click()
      })

      cy.contains('Delete User').should('be.visible')
      cy.contains('button', 'Delete').click()

      cy.get('table tbody tr').first().find('td').eq(1).invoke('text').should('not.eq', userName)
    })
  })

  it('paginates through users', () => {
    cy.contains('Page 1').should('be.visible')

    cy.get('button[title="Next page"]').click()
    cy.contains('Page 2').should('be.visible')

    cy.get('button[title="Previous page"]').click()
    cy.contains('Page 1').should('be.visible')
  })
})
