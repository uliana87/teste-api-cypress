/// <reference types="cypress" />

describe('Testes da Funcionalidade Usuários', () => {
  let token;

  before(() => {
    cy.token('fulano@qa.com', 'teste').then((tkn) => {
      token = tkn;
    });
  });

  it('Deve validar contrato de usuários', () => {
    const usuariosSchema = require('../contracts/usuarios.contratos');
    cy.request('/usuarios').then((response) => {
      expect(response.status).to.eq(200);
      return usuariosSchema.validateAsync(response.body);
    });
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request('/usuarios').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.usuarios).to.be.an('array');
    });
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    const email = `usuario${Date.now()}@qa.com`;
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: 'Usuário EBAC',
        email,
        password: 'teste',
        administrador: 'true'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
    });
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: '/usuarios',
      failOnStatusCode: false,
      body: {
        nome: 'Usuário EBAC',
        email: 'email-invalido',
        password: 'teste',
        administrador: 'true'
      }
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.email).to.eq('email deve ser um email válido');
    });
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    const email = `usuario${Date.now()}@qa.com`;
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: 'Usuário EBAC',
        email,
        password: 'teste',
        administrador: 'true'
      }
    }).then((res) => {
      const id = res.body._id;
      cy.request({
        method: 'PUT',
        url: `/usuarios/${id}`,
        headers: {
          Authorization: token
        },
        body: {
          nome: 'Usuário Alterado',
          email,
          password: 'teste123',
          administrador: 'false'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro alterado com sucesso');
      });
    });
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    const email = `usuario${Date.now()}@qa.com`;
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: 'Usuário EBAC',
        email,
        password: 'teste',
        administrador: 'true'
      }
    }).then((res) => {
      const id = res.body._id;
      cy.request({
        method: 'DELETE',
        url: `/usuarios/${id}`,
        headers: {
          Authorization: token
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    });
  });
});
