/// <reference types="cypress" />

describe('App - Movies', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/discover/movie?sort_by=popularity.desc', {
      statusCode: 200,
      body: [
        {
          $id: '1',
          title: 'Trending Movie 1',
          poster_url: 'https://example.com/poster1.jpg',
        },
        {
          $id: '2',
          title: 'Trending Movie 2',
          poster_url: 'https://example.com/poster2.jpg',
        }
      ]
    }).as('getTrending');

    cy.visit('/');
  });

  it('deve renderizar corretamente a página inicial', () => {
    cy.contains('Find').should('exist');
    cy.get('input[type="text"]').should('exist');
  });

  it('deve permitir a pesquisa e mostrar resultados', () => {
    cy.intercept('GET', '**/search/movie?query=Matrix*').as('searchMovies');

    cy.get('input[type="text"]').type('Matrix').should('have.value', 'Matrix');

    cy.wait('@searchMovies'); // aguarda chamada da API

    // Aguarda o carregamento parar
   
    cy.get('[data-testid="spinner"]').should('not.exist'); // garante que terminou o loading

    // Aguarda a lista aparecer e ter ao menos 1 filme
    cy.get('[data-testid="movie-list"] li').should('have.length.at.least', 1);

    // Garante que pelo menos um item contém 'Matrix'
    cy.get('[data-testid="movie-list"] li')
      .first()
      .should('contain.text', 'Matrix');
  });


  it('deve mostrar o spinner de carregamento durante a busca', () => {
    cy.intercept('GET', '**/search/movie?query=Batman*', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000);  // Delay para visualizar o spinner
      });
      req.reply({
        statusCode: 200,
        body: { results: [{ id: 2, title: 'Batman', poster_path: '/batman.jpg' }] },
      });
    }).as('searchBatman');

    cy.get('input[type="text"]').type('Batman');
    cy.get('[data-testid="spinner"]').should('exist');
    cy.wait('@searchBatman');
  });

  it('deve mostrar mensagem de erro se a API falhar', () => {
    cy.intercept('GET', '**/search/movie?query=Error*', {
      statusCode: 500,
      body: {},
    }).as('searchError');

    cy.get('input[type="text"]').type('Error');
    cy.wait('@searchError');
    cy.contains('Error fetching movies').should('exist');
  });

});
