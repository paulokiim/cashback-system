const uuid = require('uuid').v4;

const purchaseRepository = require('../repository/purchase');
const userRepository = require('../repository/user');
const responseTransformer = require('../../utils/responseTransformer');
const { createJWTToken } = require('../../auth');
const STATUS = require('../../enums/purchase-status');

/* Function create
1- Check if all datas exists
2- Check if user exists
3- Check if purchase exists on database
4- If not, create a new
5- If so, return error
*/
const create = async (input) => {
  const { code, value, purchaseDate, documentNumber } = input;

  if (!code || !value || !purchaseDate || !documentNumber)
    return responseTransformer.onError('Informe todos os dados');

  const checkParams = {
    code,
    value,
    purchaseDate,
    documentNumber,
  };

  const user = await userRepository.get({ documentNumber });

  if (!user) return responseTransformer.onError('Usuário não encontrado');

  const purchaseExists = await purchaseRepository.get(checkParams);

  if (!purchaseExists) {
    const params = {
      uid: uuid(),
      code,
      value,
      purchaseDate,
      documentNumber,
      status:
        documentNumber === STATUS.HIGH_PRIVILEDGE_DOCUMENT
          ? STATUS.APPROVED
          : STATUS.PENDING_REQUEST,
      deleted: false,
    };

    const response = await purchaseRepository.create(params);
    return responseTransformer.onSuccess(response);
  }
  return responseTransformer.onError('Compra já está registrada');
};

/* Function edit
1- Check if all datas exists
2- Check if purchase exists on database
4- Check if purchase is deleted
5- Check if purchase is Approved
6- If not, edit purchase
7- If so, return error
*/
const edit = async (input) => {
  const { code, purchaseDate, documentNumber, editedValues } = input;

  if (!code || !purchaseDate || !documentNumber)
    return responseTransformer.onError('Informe todos os dados');

  const checkParams = {
    code,
    purchaseDate,
    documentNumber,
  };

  const purchase = await purchaseRepository.get(checkParams);

  if (purchase && purchase.deleted === false) {
    if (purchase.status === STATUS.APPROVED)
      return responseTransformer.onError('Status já aprovado');
    const [_, [updatedPurchase]] = await purchaseRepository.update(
      editedValues,
      checkParams
    );
    return responseTransformer.onSuccess(updatedPurchase);
  }

  return responseTransformer.onError('Compra não foi encontrada');
};

/* Function remove
1- Check if all datas exists
2- Check if purchase exists on database
4- Check if purchase is deleted
5- Check if purchase is Approved
6- If not, remove purchase
7- If so, return error
*/
const remove = (input) => {
  const editedValues = {
    deleted: true,
  };
  return edit({ ...input, editedValues });
};

/* Function getAll
1- Get all using documentNumber and deleted to filter
2- Return datas
*/
const getAll = async (input) => {
  const { documentNumber } = input;
  const whereParams = {
    documentNumber,
    deleted: false,
  };

  const response = await purchaseRepository.getAll(whereParams);

  const parsedResponse = response.map((data) => ({
    code: data.code,
    value: data.value,
    purchaseData: data.purchaseDate,
  }));

  return responseTransformer.onSuccess(parsedResponse);
};

module.exports = {
  create,
  edit,
  remove,
  getAll,
};
