/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
  var token;

  if (req.headers && req.headers.authorization) {
    // Pega o token do request header
    token = req.headers.authorization;
  } else if (req.param('token')) {
    // Se o token não estiver no header, tenta pegar do body
    token = req.param('token');
    // Deleta o token dos parametros pra não dar conflito nos controllers
    delete req.query.token;
  } else {
    return res.json(401, {err: 'O cabeçalho de autenticação não foi encontrado.'});
  }

  jwToken.verify(token, function (err, validToken) {
    // Se o token não for válido
    if (err) return res.json(401, {err: 'Token inválido!'});

    // Busca no BD o usuário autenticado e passa no request
    User.findOne({id: validToken.id}).then(function(userEncontrado){
      if(userEncontrado){
        if(userEncontrado.tokens.indexOf(token) == -1)
          return res.json(401, {err: 'Token inválido!'});

        // Se o usuário existe, seta ele no request e passa para o controller
        req.userAtivo = userEncontrado;
        next();
      } else {
        return res.json(401, {err: 'Token pertence a um usuário que não existe mais.'});
      }
    }).catch(function(err){
      return res.json(500, {err: 'Erro ao recuperar usuário no banco de dados.'});
    });

    //req.token = token; // This is the decrypted token or the payload you provided
    //sails.log.debug(token);
  });
};
