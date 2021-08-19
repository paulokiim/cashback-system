const expect = require('chai').expect;
const faker = require('faker');

const cashbackService = require('../../src/services/boticario-cashback');

describe('Testing external api from Boticario', () => {
  describe('When documentNumber is invalid', () => {
    it('Should return status 400 and erro message ', async () => {
      const response = await cashbackService(faker.datatype.string());

      expect(response.status).to.equal(400);
      expect(response.data.message).to.equal(
        'CPF do revendedor(a) está incorreto, utilize apenas números!'
      );
    });
  });
  describe('When documentNumber is valid', () => {
    it('Should return status 200 and credits ', async () => {
      const documentNumber = faker.datatype.number();

      const response = await cashbackService(documentNumber);

      expect(response.status).to.equal(200);
      expect(response.data).to.have.any.keys('credit');
    });
  });
});
