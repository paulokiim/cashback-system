const expect = require('chai').expect;
const sinon = require('sinon');
const faker = require('faker');

const purchaseBO = require('../../src/core/business-operation/purchase');
const cashbackBO = require('../../src/core/business-operation/cashback');
const purchaseRepository = require('../../src/core/repository/purchase');
const cashbackRepository = require('../../src/core/repository/cashback');
const userRepository = require('../../src/core/repository/user');
const STATUS = require('../../src/enums/purchase-status');

describe('Testing purchase business-operation', () => {
  // CREATING NEW PURCHASE
  describe('Creating new purchase', () => {
    let createPurchaseStub;
    let getUserStub;
    let createCashbackStub;

    const mockValues = {
      uid: faker.datatype.uuid(),
      code: faker.datatype.string(),
      value: faker.datatype.number(),
      purchaseDate: faker.datatype.datetime(),
      documentNumber: faker.datatype.string(),
      purchaseUid: faker.datatype.uuid(),
      status: faker.datatype.string(),
    };

    describe('When purchase doenst exist and documentNumber is not priviledged', () => {
      const mockedNotPriviledged = {
        ...mockValues,
        status: STATUS.PENDING_REQUEST,
      };

      before(() => {
        createPurchaseStub = sinon
          .stub(purchaseRepository, 'create')
          .returns(mockedNotPriviledged);
        getUserStub = sinon
          .stub(userRepository, 'get')
          .returns(mockedNotPriviledged);
        createCashbackStub = sinon
          .stub(cashbackRepository, 'create')
          .returns({});
      });

      after(() => {
        purchaseRepository.create.restore();
        userRepository.get.restore();
        cashbackRepository.create.restore();
      });

      it('Should return 200 and status Em validação', async () => {
        const { status, data } = await purchaseBO.create(mockedNotPriviledged);

        expect(status).to.equal(200);
        expect(data.purchase.code).to.equal(mockedNotPriviledged.code);
        expect(data.purchase.purchaseDate).to.equal(
          mockedNotPriviledged.purchaseDate
        );
        expect(data.purchase.documentNumber).to.equal(
          mockedNotPriviledged.documentNumber
        );
        expect(data.purchase.status).to.equal(STATUS.PENDING_REQUEST);
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
        createCashbackStub = sinon
          .stub(cashbackRepository, 'create')
          .returns({});
      });

      after(() => {
        purchaseRepository.create.restore();
        userRepository.get.restore();
        cashbackRepository.create.restore();
      });

      it('Should return 200 and status Aprovado', async () => {
        const { status, data } = await purchaseBO.create(input);

        expect(status).to.equal(200);
        expect(data.purchase.code).to.equal(input.code);
        expect(data.purchase.purchaseDate).to.equal(input.purchaseDate);
        expect(data.purchase.documentNumber).to.equal(
          STATUS.HIGH_PRIVILEDGE_DOCUMENT
        );
        expect(data.purchase.status).to.equal(STATUS.APPROVED);
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

    describe('When cashback failed to be created', () => {
      before(() => {
        getUserStub = sinon.stub(userRepository, 'get').returns({});
        createPurchaseStub = sinon
          .stub(purchaseRepository, 'create')
          .returns(mockValues);
        createCashbackStub = sinon
          .stub(cashbackRepository, 'create')
          .returns('Error trying to create cashback');
      });

      after(() => {
        purchaseRepository.create.restore();
        cashbackRepository.create.restore();
        userRepository.get.restore();
      });

      it('Should return 400 and cashback creation error', async () => {
        const { status, data } = await purchaseBO.create(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.be.equal('Erro ao tentar criar cashback');
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

  // GET ALL PURCHASES
  describe('Get all purchases', () => {
    let getAllPurchaseStub;
    let getManyCashbackStub;

    const mockValues = {
      documentNumber: faker.datatype.string(),
    };

    const mockedPurchase = {
      code: faker.datatype.string(),
      purchaseDate: faker.datatype.datetime(),
      value: faker.datatype.number(),
    };
    const mockedCashback = {
      value: faker.datatype.number(),
      percentage: faker.datatype.number(),
    };

    describe('When all data returns successfully', () => {
      const cashbacks = [];
      const purchases = [];
      const mockedResult = [];
      before(() => {
        for (let i = 0; i < 5; i++) {
          cashbacks.push(mockedCashback);
          purchases.push(mockedPurchase);
          mockedResult.push({
            ...purchases[i],
            cashbackValue: cashbacks[i].value,
            cashbackPercentage: cashbacks[i].percentage,
          });
        }
        getAllPurchaseStub = sinon
          .stub(purchaseRepository, 'getAll')
          .returns(purchases);
        getManyCashbackStub = sinon
          .stub(cashbackRepository, 'get')
          .returns(cashbacks);
      });

      after(() => {
        purchaseRepository.getAll.restore();
        cashbackRepository.get.restore();
      });

      it('Should return all datas from a documentNumber', async () => {
        const { status, data } = await purchaseBO.getAll(mockValues);

        expect(status).to.equal(200);
        expect(data).to.eql(mockedResult);
      });
    });

    describe('When cashbacks and purchases have different length', () => {
      const cashbacks = [];
      const purchases = [];
      const mockedResult = [];
      before(() => {
        for (let i = 0; i < 5; i++) {
          cashbacks.push(mockedCashback);
          purchases.push(mockedPurchase);
          mockedResult.push({
            ...purchases[i],
            cashbackValue: cashbacks[i].value,
            cashbackPercentage: cashbacks[i].percentage,
          });
        }
        purchases.pop();
        getAllPurchaseStub = sinon
          .stub(purchaseRepository, 'getAll')
          .returns(purchases);
        getManyCashbackStub = sinon
          .stub(cashbackRepository, 'get')
          .returns(cashbacks);
      });

      after(() => {
        purchaseRepository.getAll.restore();
        cashbackRepository.get.restore();
      });

      it('Should return status 400 and different length error', async () => {
        const { status, data } = await purchaseBO.getAll(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Quantidade de dados incorreto');
      });
    });

    describe('When cashbacks and cant get cashbacks', () => {
      before(() => {
        getAllPurchaseStub = sinon
          .stub(purchaseRepository, 'getAll')
          .returns([]);
        getManyCashbackStub = sinon
          .stub(cashbackRepository, 'get')
          .returns('Error trying to get many cashbacks');
      });

      after(() => {
        purchaseRepository.getAll.restore();
        cashbackRepository.get.restore();
      });

      it('Should return status 400 and trying to get cashback error', async () => {
        const { status, data } = await purchaseBO.getAll(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Erro ao tentar buscar os cashbacks');
      });
    });
  });
});
