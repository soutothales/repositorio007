/**
 * isGerente
 *
 * @description :: Policy para checar se usuário logado é gerente
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
  userAtivo = req.userAtivo;
  // Se usuario que enviou o request for do nivel aluno ou coach
  if(userAtivo.nivel === User.Niveis.ALUNO || userAtivo.nivel === User.Niveis.COACH) {
    return res.json(403, {err: 'Você não tem permissão para executar esta ação.'});
  }

  next();
};
