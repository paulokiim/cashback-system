const expect = require('chai').expect;
const sinon = require('sinon');
const faker = require('faker');

const purchaseBO = require('../../src/core/business-operation/purchase');
const purchaseRepository = require('../../src/core/repository/purchase');
const userRepository = require('../../src/core/repository/user');
const STATUS = require('../../src/enums/purchase-status');

describe('Testing purchase business-operation', () => {
  // CREATING NEW PURCHASE
  describe('Creating new purchase', () => {
    let createPurchaseStub;
    let getUserStub;

    const mockValues = {
      uid: faker.datatype.uuid(),
      code: faker.datatype.string(),
      value: faker.datatype.number(),
      purchaseDate: faker.datatype.datetime(),
      documentNumber: faker.datatype.string(),
      status: faker.datatype.string(),
    };

    describe('When purchase doenst exist and documentNumber is not priviledged', () => {
      const input = {
        ...mockValues,
        status: STATUS.PENDING_REQUEST,
      };

      before(() => {
        createPurchaseStub = sinon
          .stub(purchaseRepository, 'create')
          .returns(input);
        getUserStub = sinon.stub(userRepository, 'get').returns(input);
      });

      after(() => {
        purchaseRepository.create.restore();
        userRepository.get.restore();
      });

      it('Should return 200 and status Em validação', async () => {
        const { status, data } = await purchaseBO.create(input);

        expect(status).to.equal(200);
        expect(data.code).to.equal(input.code);
        expect(data.purchaseDate).to.equal(input.purchaseDate);
        expect(data.documentNumber).to.equal(input.documentNumber);
        expect(data.status).to.equal(STATUS.PENDING_REQUEST);
      });
    });

    describe('When purchase doesnt exist and documentNumber is priviledged', () => {
      const input = {
        ...mockValues,
        documentNumber: STATUS.HIGH_PRIVILEDGE_DOCUMENT,
        status: STATUS.APPROVED,
      };

      before(() => {
        createPurchaseStub = sinon
          .stub(purchaseRepository, 'create')
          .returns(input);
        getUserStub = sinon.stub(userRepository, 'get').returns(input);
      });

      after(() => {
        purchaseRepository.create.restore();
        userRepository.get.restore();
      });

      it('Should return 200 and status Aprovado', async () => {
        const { status, data } = await purchaseBO.create(input);

        expect(status).to.equal(200);
        expect(data.code).to.equal(input.code);
        expect(data.purchaseDate).to.equal(input.purchaseDate);
        expect(data.documentNumber).to.equal(STATUS.HIGH_PRIVILEDGE_DOCUMENT);
        expect(data.status).to.equal(STATUS.APPROVED);
      });
    });

    describe('When values are missing', () => {
      it('Should return 400 with invalid input error', async () => {
        const { status, data } = await purchaseBO.create({});

        expect(status).to.equal(400);
        expect(data.message).to.equal('Informe todos os dados');
      });
    });

    describe('When user doesnt exist', () => {
      before(() => {
        getUserStub = sinon.stub(userRepository, 'get').returns();
      });

      after(() => {
        userRepository.get.restore();
      });

      it('Should return 400 and user not found error', async () => {
        const { status, data } = await purchaseBO.create(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Usuário não encontrado');
      });
    });

    describe('When purchase already exists', () => {
      before(() => {
        getPurchaseStub = sinon.stub(purchaseRepository, 'get').returns({});
        getUserStub = sinon.stub(userRepository, 'get').returns({});
      });

      after(() => {
        purchaseRepository.get.restore();
        userRepository.get.restore();
      });

      it('Should return 400 and purchase exist error', async () => {
        const { status, data } = await purchaseBO.create(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Compra já está registrada');
      });
    });
  });

  // EDITING PURCHASE
  describe('Editing purchase', () => {
    let getPurchaseStub;
    let updatePurchaseStub;

    const editedValues = {
      code: faker.datatype.string(),
      purchaseDate: faker.datatype.datetime(),
      documentNumber: faker.datatype.string(),
    };

    const mockValues = {
      uid: faker.datatype.uuid(),
      code: faker.datatype.string(),
      value: faker.datatype.number(),
      purchaseDate: faker.datatype.datetime(),
      documentNumber: faker.datatype.string(),
      deleted: false,
      editedValues,
    };

    describe('When values are missing', () => {
      it('Should return 400 with invalid input error', async () => {
        const { status, data } = await purchaseBO.edit({});

        expect(status).to.equal(400);
        expect(data.message).to.equal('Informe todos os dados');
      });
    });

    describe('When purchase doesnt exist', () => {
      before(() => {
        getPurchaseStub = sinon.stub(purchaseRepository, 'get').returns();
      });

      after(() => {
        purchaseRepository.get.restore();
      });

      it('Should return 400 and purchase doesnt exist error', async () => {
        const { status, data } = await purchaseBO.edit(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Compra não foi encontrada');
      });
    });

    describe('When purchase has status Approved', () => {
      const mockedWithApproved = {
        ...mockValues,
        status: STATUS.APPROVED,
      };

      before(() => {
        getPurchaseStub = sinon
          .stub(purchaseRepository, 'get')
          .returns(mockedWithApproved);
      });

      after(() => {
        purchaseRepository.get.restore();
      });

      it('Should return 400 and already approved error', async () => {
        const { status, data } = await purchaseBO.edit(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Status já aprovado');
      });
    });

    describe('When purchase was deleted', () => {
      const mockedWithDeleted = {
        ...mockValues,
        deleted: true,
      };

      before(() => {
        getPurchaseStub = sinon
          .stub(purchaseRepository, 'get')
          .returns(mockedWithDeleted);
      });

      after(() => {
        purchaseRepository.get.restore();
      });

      it('Should return 400 and purchase doesnt exist error', async () => {
        const { status, data } = await purchaseBO.edit(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Compra não foi encontrada');
      });
    });

    describe('When purchase is edited successfully', () => {
      before(() => {
        getPurchaseStub = sinon
          .stub(purchaseRepository, 'get')
          .returns(mockValues);
        updatePurchaseStub = sinon
          .stub(purchaseRepository, 'update')
          .returns([1, [editedValues]]);
      });

      after(() => {
        purchaseRepository.get.restore();
        purchaseRepository.update.restore();
      });

      it('Should return 200 and edit purchase', async () => {
        const { status, data } = await purchaseBO.edit(mockValues);

        expect(status).to.equal(200);
        expect(data.code).to.equal(editedValues.code);
        expect(data.value).to.equal(editedValues.value);
        expect(data.purchaseDate).to.equal(editedValues.purchaseDate);
        expect(data.documentNumber).to.equal(editedValues.documentNumber);
      });
    });
  });

  // REMOVING PURCHASE
  describe('Removing purchase', () => {
    let getPurchaseStub;
    let updatePurchaseStub;

    const mockValues = {
      code: faker.datatype.string(),
      purchaseDate: faker.datatype.datetime(),
      documentNumber: faker.datatype.string(),
      deleted: false,
    };

    describe('When values are missing', () => {
      it('Should return 400 with invalid input error', async () => {
        const { status, data } = await purchaseBO.remove({});

        expect(status).to.equal(400);
        expect(data.message).to.equal('Informe todos os dados');
      });
    });

    describe('When purchase doesnt exist', () => {
      before(() => {
        getPurchaseStub = sinon.stub(purchaseRepository, 'get').returns();
      });

      after(() => {
        purchaseRepository.get.restore();
      });

      it('Should return 400 and purchase doesnt exist error', async () => {
        const { status, data } = await purchaseBO.remove(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Compra não foi encontrada');
      });
    });

    describe('When purchase was deleted', () => {
      const mockedWithDeleted = {
        ...mockValues,
        deleted: true,
      };

      before(() => {
        getPurchaseStub = sinon
          .stub(purchaseRepository, 'get')
          .returns(mockedWithDeleted);
      });

      after(() => {
        purchaseRepository.get.restore();
      });

      it('Should return 400 and purchase doesnt exist error', async () => {
        const { status, data } = await purchaseBO.remove(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Compra não foi encontrada');
      });
    });

    describe('When purchase has status Approved', () => {
      const mockedWithApproved = {
        ...mockValues,
        status: STATUS.APPROVED,
      };

      before(() => {
        getPurchaseStub = sinon
          .stub(purchaseRepository, 'get')
          .returns(mockedWithApproved);
      });

      after(() => {
        purchaseRepository.get.restore();
      });

      it('Should return 400 and already approved error', async () => {
        const { status, data } = await purchaseBO.remove(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Status já aprovado');
      });
    });

    describe('When purchase is removed successfully', () => {
      const mockDeletedData = {
        ...mockValues,
        deleted: true,
      };
      before(() => {
        getPurchaseStub = sinon
          .stub(purchaseRepository, 'get')
          .returns(mockValues);
        updatePurchaseStub = sinon
          .stub(purchaseRepository, 'update')
          .returns([1, [mockDeletedData]]);
      });

      after(() => {
        purchaseRepository.get.restore();
        purchaseRepository.update.restore();
      });

      it('Should return 200 and edit purchase', async () => {
        const { status, data } = await purchaseBO.remove(mockValues);

        expect(status).to.equal(200);
        expect(data.deleted).to.equal(mockDeletedData.deleted);
      });
    });
  });

  describe('Get all purchases', () => {
    let getAllPurchaseStub;

    const mockValues = {
      documentNumber: faker.datatype.string(),
    };

    const returnData = [];

    before(() => {
      getAllPurchaseStub = sinon
        .stub(purchaseRepository, 'getAll')
        .returns(returnData);
    });

    after(() => {
      purchaseRepository.getAll.restore();
    });

    it('Should return all datas from a documentNumber', async () => {
      const { status, data } = await purchaseBO.getAll(mockValues);

      expect(status).to.equal(200);
    });
  });
});
