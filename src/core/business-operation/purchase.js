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
1- Check if user exists on database
2- If not, return error
3- If so, create a token for this documentNumber
3.1 - Return response with token
*/
const edit = async (input) => {
  const { code, value, purchaseDate, documentNumber, editedValues } = input;

  if (!code || !value || !purchaseDate || !documentNumber)
    return responseTransformer.onError('Informe todos os dados');

  const checkParams = {
    code,
    value,
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

/* Function edit
1- Check if user exists on database
2- If not, return error
3- If so, create a token for this documentNumber
3.1 - Return response with token
*/
const remove = async (input) => {
  const params = {
    documentNumber: input.documentNumber,
    password: md5(input.password),
  };

  const user = await purchaseRepository.get(params);
  if (!user) {
    return responseTransformer.onError('CPF ou Senha incorreta');
  }

  const token = createJWTToken(user.uid);
  if (token) {
    const response = {
      token,
      user,
    };
    return responseTransformer.onSuccess(response);
  }

  return responseTransformer.onError('CPF nao encontrado');
};

/* Function edit
1- Check if user exists on database
2- If not, return error
3- If so, create a token for this documentNumber
3.1 - Return response with token
*/
const getAll = async (input) => {
  const params = {
    documentNumber: input.documentNumber,
    password: md5(input.password),
  };

  const user = await purchaseRepository.get(params);
  if (!user) {
    return responseTransformer.onError('CPF ou Senha incorreta');
  }

  const token = createJWTToken(user.uid);
  if (token) {
    const response = {
      token,
      user,
    };
    return responseTransformer.onSuccess(response);
  }

  return responseTransformer.onError('CPF nao encontrado');
};

module.exports = {
  create,
  edit,
  remove,
  getAll,
};
