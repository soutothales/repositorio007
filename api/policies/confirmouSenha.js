/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
  User.findOne({id: req.param('id')})
  .exec(function(err, userEncontrado){
    if(err){
      return res.json(500, {err: 'Erro ao recuperar os usuários no banco de dados.'});
    }
    // Encontrou usuário
    if(userEncontrado){
      if(req.body.novaSenha) {
        if(!req.body.senhaAtual){
          return res.json(400, {err: 'É necessário confirmar a senha atual para modificá-la.'});
        } else {
          User.compararSenha(req.body.senhaAtual, userEncontrado, function (err, valida) {
            if (err) {
              return res.json(500, {err: 'Erro ao validar senha.'});
            }
            // Se a senha não bater com a do BD
            if (!valida) {
              return res.json(401, {err: 'Senha inválida.'});
           // Se a senha estiver correta, retorna o User e seu token de autenticação
            } else {
              next();
            }
          });
        }
      } else {
        next();
      }
    // Usuário não encontrado
    } else {
      return res.json(404, {err: 'Usuário não encontrado.'});
    }
  });



};
