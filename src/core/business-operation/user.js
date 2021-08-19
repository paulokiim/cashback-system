const md5 = require('md5');
const userRepository = require('../repository/user');
const responseTransformer = require('../../utils/responseTransformer');
const auth = require('../../auth');

/* Function register
1- Check if user exists on database
2- If not, create a new
3- If so, return error
*/
const register = async (input) => {
  const { fullName, documentNumber, email, password } = input;

  const checkUser = { documentNumber };

  const userExists = await userRepository.get(checkUser);

  if (!userExists) {
    const params = {
      fullName,
      documentNumber,
      password: md5(password),
      email,
    };

    const response = await userRepository.create(params);
    return responseTransformer.onSuccess(response);
  }
  return responseTransformer.onError('Usuario existente');
};

/* Function login
1- Check if user exists on database
2- If not, return error
3- If so, create a token for this documentNumber
3.1 - Return response with token
*/
const login = async (input) => {
  const params = {
    documentNumber: input.documentNumber,
    password: md5(input.password),
  };

  const user = await userRepository.get(params);

  if (!user) {
    return responseTransformer.onError('CPF ou Senha incorreta');
  }

  const token = auth.createJWTToken(user.documentNumber);
  if (token) {
    const response = {
      token,
      user,
    };
    return responseTransformer.onSuccess(response);
  }

  return responseTransformer.onError('Não foi possível criar um token');
};

module.exports = {
  register,
  login,
};
