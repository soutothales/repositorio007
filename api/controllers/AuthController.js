/**
 * AuthController
 *
 * Autenticação de usuário
 * return: User e token de autenticação
 *
 */

module.exports = {
  login: function (req, res) {
    var login = req.param('login');
    var senha = req.param('senha');

    if (!login || !senha) {
      return res.json(400, {err: 'Login e senha são necessários'});
    }

    User.findOne({login: login})
    .populate('projeto')
    .populate('sala')
    .populate('agenda')
    .exec(function (err, user) {
      if (err) {
        return res.json(500, {err: 'Erro ao recuperar usuário do banco de dados.'});
      }

      if (!user) {
        return res.json(401, {err: 'Login ou senha inválidos'});
      }

      if(user.sala){
        var sala = user.sala;
      }
      if(user.projeto){
        var projeto = user.projeto;
      }
      if(user.agenda){
        var agenda = user.agenda;
      }
      User.compararSenha(senha, user, function (err, valida) {
        if (err) {
          return res.json(500, {err: 'Erro ao validar senha.'});
        }
        // Se a senha não bater com a do BD
        if (!valida) {
          return res.json(401, {err: 'Login ou senha inválidos'});
        // Se a senha estiver correta, retorna o User e seu token de autenticação
        } else {
          var token = jwToken.issue({id : user.id });
          user.tokens.push(token);
          user.save(function(err){
  					if(err) return res.json(500, {err: 'Erro ao gerar token de autenticação.'});
            if(sala) user.sala = sala;
            if(projeto) user.projeto = projeto;
            if(agenda) user.agenda = agenda;
            res.json({
              user: user,
              token: token
            });
          });
        }
      });
    })
  },

  logout: function (req, res) {
    userAtivo = req.userAtivo;

    User.findOne({id: userAtivo.id}, function (err, user) {
      if(err) {
        return res.json(500, {err: 'Erro ao recuperar usuário do banco de dados.'});
      }

      if (!user) {
        return res.json(404, {err: 'Este usuário não existe mais.'});
      }

      var index = user.tokens.indexOf(req.headers.authorization);
      if(index == -1){
        return res.json(401, {err: 'Token inválido.'});
      }

      user.tokens.splice(index, 1);
      user.save(function(err){
       if(err) return res.json(500, {err: 'Erro ao invalidar token.'});

       return res.ok();
      });
    });
  }

};
