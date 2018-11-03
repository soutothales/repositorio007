/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'asales',
  api_key: '415796641531546',
  api_secret: 'HtNds2ZPy1WACIwE3oar1yfs7Fw'
});

module.exports = {

	create: function(req, res) {
		// Usuario que enviou o request
		userAtivo = req.userAtivo;
		criar = {};

		// Se o usuario for gerente, não pode criar admin
		if(userAtivo.nivel === User.Niveis.GERENTE){
			if(req.body.nivel && req.body.nivel.toLowerCase() === User.Niveis.ADMIN){
					return res.json(403, {err: 'Você não tem permissão para executar esta ação.'});
			}
		}

		// Adiciona usuário que está criando
		req.body.criadoPor = userAtivo.id;
		criar.criadoPor = userAtivo.id;

		// Garante que o request possui login, senha, nome e que o nivel é válido
		// Ignora parâmetros que não fazem parte do schema
		if(req.body.login == undefined || !req.body.login.trim()){
			return res.json(400, {err: 'Campo login é necessário.'});
		} else {
			criar.login = req.body.login.trim();
		}
		if(req.body.senha == undefined || !req.body.senha){
			return res.json(400, {err: 'Campo senha é necessário.'});
		} else {
			criar.senha = req.body.senha;
		}
		if(req.body.nome == undefined || !req.body.nome.trim()){
			return res.json(400, {err: 'Campo nome é necessário.'});
		} else {
			criar.nome = req.body.nome.trim();
		}
		if(req.body.nivel){
			if(!User.verificarNivel(req.body.nivel.toLowerCase())){
				return res.json(400, {err: req.body.nivel + ' não é um nível válido.'});
			} else {
				criar.nivel = req.body.nivel.toLowerCase();
			}
		}

    // Verifica se competencias é array
    if(req.body.competencias != undefined && Object.prototype.toString.call(req.body.competencias) === '[object Array]') {
      criar.competencias = req.body.competencias;
    }
		if(req.body.descricao != undefined) criar.descricao = req.body.descricao;
		if(req.body.email != undefined) criar.email= req.body.email;
		// TODO: Permitir adicionar direto em uma sala

		User.create(criar).exec(function(err, user){
			if(err){
			  sails.log.debug('regra invalida: ' + err.invalidAttributes.login[0].rule);
				if(err.invalidAttributes && err.invalidAttributes.login &&
					err.invalidAttributes.login[0] && err.invalidAttributes.login[0].rule === 'unique'){
						return res.json(409, {err: 'Este login já está em uso por outro usuário.'});
					}
				if(err.invalidAttributes && err.invalidAttributes.login &&
					err.invalidAttributes.login[0] && err.invalidAttributes.login[0].rule === 'minLength'){
						return res.json(400, {err: 'O login deve conter pelo menos 5 caracteres.'});
					}
				if(err.invalidAttributes && err.invalidAttributes.login &&
					err.invalidAttributes.login[0] && err.invalidAttributes.login[0].rule === 'maxLength'){
						return res.json(400, {err: 'O login deve conter no máximo 15 caracteres.'});
					}
				if(err.invalidAttributes && err.invalidAttributes.nome &&
					err.invalidAttributes.nome[0] && err.invalidAttributes.nome[0].rule === 'minLength'){
						return res.json(400, {err: 'O nome deve conter pelo menos 2 caracteres.'});
					}
				if(err.invalidAttributes && err.invalidAttributes.nome &&
					err.invalidAttributes.nome[0] && err.invalidAttributes.nome[0].rule === 'maxLength'){
						return res.json(400, {err: 'O nome deve conter no máximo 30 caracteres.'});
					}
				if(err.invalidAttributes && err.invalidAttributes.email &&
					err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique'){
						return res.json(409, {err: 'Este email já está em uso por outro usuário.'});
					}
				if(err.invalidAttributes && err.invalidAttributes.email &&
					err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'email'){
						return res.json(400, {err: 'Email inválido.'});
					}
				return res.json(err.status, {err: err});
			}
			if(user){
				sails.log.debug("User criado. Nome: " + user.nome);
				return res.json(200, {user: user});
			}
		});
	},

	findOne: function(req, res){
		// Usuario que enviou o request
		userAtivo = req.userAtivo;

		// Busca no BD o usuário pedido
		User.findOne({id: req.param('id')})
    .populate('sala')
    .populate('projeto')
    .populate('agenda')
		.exec(function(err, userEncontrado){
			if(err){
				return res.json(500, {err: 'Erro ao recuperar os usuários no banco de dados.'});
			}
			// Encontrou usuário
			if(userEncontrado){
				return res.json(200, {user: userEncontrado});
			// Usuário não encontrado
			} else {
				return res.json(404, {err: 'Usuário não encontrado.'});
			}
		});
	},

	find: function(req, res){
		userAtivo = req.userAtivo;

		queryObj = {
			nivel: [User.Niveis.COACH, User.Niveis.ALUNO, User.Niveis.GERENTE]
		};
		if(userAtivo.nivel === User.Niveis.ADMIN){
			queryObj = {
				nivel: [User.Niveis.COACH, User.Niveis.ALUNO, User.Niveis.GERENTE, User.Niveis.ADMIN]
			};
		}

		if(req.param('nivel') != undefined && req.param('nivel').trim().length > 0){
			// Só admin pode ver outro admin
			if(req.param('nivel') === User.Niveis.ADMIN && userAtivo.nivel != User.Niveis.ADMIN){
				return res.json(403, {err: 'Você não tem permissão para ver estes usuários.'});
			} else if(User.verificarNivel(req.param('nivel'))) {
				queryObj = {nivel: req.param('nivel')};
			} else {
				return res.json(400, {err: req.param('nivel') + ' não é um nível válido.'});
			}
		}

		if(req.param('nome') != undefined){
			queryObj.nome = {'contains': req.param('nome')};
		}

		User.find(queryObj)
    .populate('sala')
    .populate('projeto')
    .populate('agenda')
		.exec(function(err, users){
			if(err){
				return res.json(500, {err: 'Erro ao recuperar os usuários no banco de dados.'});
			}
			// Se achou usuários
			if(users){
				return res.json(200, {users: users});
			} else {
				return res.json(404, {err: 'Nenhum usuário encontrado.'});
			}
		});
	},

	update: function(req, res) {
		// Usuario que enviou o request
		userAtivo = req.userAtivo;
		// Id do user a ser a atualizado
		idPassado = req.param('id');
		// Cria objeto apenas com os parâmetros aceitos, ignorando os outros
		atualizar = {};
		if(req.body.nome != undefined && req.body.nome.trim())
			atualizar.nome = req.body.nome.trim();
		if(req.body.novaSenha) {
			atualizar.novaSenha = req.body.novaSenha;
			if(idPassado === userAtivo.id){
				atualizar.tokens = [req.headers.authorization];
			} else {
				atualizar.tokens = [];
			}
		}
		// Descrição pode ser string vazia
		if(req.body.descricao != undefined) atualizar.descricao = req.body.descricao.trim();
		// Verifica se competencias é array
		if(req.body.competencias != undefined && Object.prototype.toString.call(req.body.competencias) === '[object Array]') {
		  atualizar.competencias = req.body.competencias;
    }
		if(req.body.email != undefined) atualizar.email = req.body.email.trim();

		// Se nenhum parâmetro foi passado
		if(Object.keys(atualizar).length === 0){
			return res.json(400, {err: 'Nenhum parâmetro foi passado corretamente.'});
		}

		// Se o usuário está editando ele mesmo
		if(idPassado === userAtivo.id){

			User.update({id: userAtivo.id}, atualizar)
			.exec(function(err, userAtualizado){
				if(err){
          if(err.invalidAttributes && err.invalidAttributes.email &&
            err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique'){
            return res.json(409, {err: 'Este email já está em uso por outro usuário.'});
          }
          if(err.invalidAttributes && err.invalidAttributes.email &&
            err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'email'){
            return res.json(400, {err: 'Email inválido.'});
          }

					return res.json(500, {err: 'Erro ao atualizar dados do usuário.'});
				}
				sails.log.debug(userAtualizado[0]);
				// Atualizou com sucesso
				if(userAtualizado[0]){
					sails.log.debug("User atualizado. Nome: " + userAtualizado[0].nome);
					return res.json(200, {user: userAtualizado[0]});
				// Se usuário não existe?
				} else {
					return res.json(404, {err: 'Usuário não encontrado.'});
				}
			});
		// Se o usuário for coach e quer editar um usuário do seu projeto
	} else if(userAtivo.nivel === User.Niveis.COACH && userAtivo.projeto) {
			User.update({
				id: idPassado,
				projeto: userAtivo.projeto,
				nivel: User.Niveis.ALUNO
			}, atualizar)
			.exec(function(err, userAtualizado){
				if(err){
          if(err.invalidAttributes && err.invalidAttributes.email &&
            err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique'){
            return res.json(409, {err: 'Este email já está em uso por outro usuário.'});
          }
          if(err.invalidAttributes && err.invalidAttributes.email &&
            err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'email'){
            return res.json(400, {err: 'Email inválido.'});
          }

					return res.json(500, {err: 'Erro ao atualizar dados do usuário.'});
				}
				// Atualizou com sucesso
				if(userAtualizado[0]){
					sails.log.debug("User atualizado. Nome: " + userAtualizado[0].nome);
					return res.json(200, {user: userAtualizado[0]});
				// Se o usuário não foi criado pelo usuário logado ou não existe
				} else {
					return res.json(403, {err: 'Você não tem permissão para editar este usuário ou este usuário não existe.'});
				}
			});
			// Se o usuário for admin ou gerente, pode editar qualquer um
		} else if(userAtivo.nivel === User.Niveis.ADMIN ||
			userAtivo.nivel === User.Niveis.GERENTE){

			User.update({
				id: idPassado,
			}, atualizar)
			.exec(function(err, userAtualizado){
				if(err){
          if(err.invalidAttributes && err.invalidAttributes.email &&
            err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique'){
            return res.json(409, {err: 'Este email já está em uso por outro usuário.'});
          }
          if(err.invalidAttributes && err.invalidAttributes.email &&
            err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'email'){
            return res.json(400, {err: 'Email inválido.'});
          }

					return res.json(500, {err: 'Erro ao atualizar dados do usuário.'});
				}
				// Atualizou com sucesso
				if(userAtualizado[0]){
					sails.log.debug("User atualizado. Nome: " + userAtualizado[0].nome);
					return res.json(200, {user: userAtualizado[0]});
				// Se o usuário não foi criado pelo usuário logado ou não existe
				} else {
					return res.json(403, {err: 'Você não tem permissão para editar este usuário ou este usuário não existe.'});
				}
			});
		} else {
			return res.json(403, {err: 'Você não tem permissão para editar este usuário.'});
		}
  },

	uploadAvatar: function (req, res) {
		// Usuario que enviou o request
		userAtivo = req.userAtivo;

		nomeFinal = userAtivo.id;

		// BASE 64
		if(req.body.avatarB64){
      sails.log.debug('image 64:');
      fs.writeFile(require('path').resolve(sails.config.appPath, 'assets/images/tempUploads') + '/' + nomeFinal,
        req.body.avatarB64.split(',')[1], 'base64', function(err) {
          if(err) {
            return res.json(500, {err: 'Erro ao fazer upload do arquivo.'});
          } else {
            cloudinary.uploader.upload(require('path').resolve(sails.config.appPath, 'assets/images/tempUploads') + '/' + nomeFinal,
              function (result) {
                // Delete imagem temporaria
                fs.unlinkSync(require('path').resolve(sails.config.appPath, 'assets/images/tempUploads') + '/' + nomeFinal);
                sails.log.debug(result);
                // se deu certo
                if (result.secure_url) {
                  User.update(userAtivo.id, {
                    avatarUrl: result.secure_url
                  })
                    .exec(function (err, userAtualizado) {
                      if (err) return res.negotiate(err);
                      if (userAtualizado[0]) {
                        return res.json(200, {user: userAtualizado[0]});
                      } else {
                        return res.json(404, {err: 'Usuário não encontrado.'});
                      }
                    });
                  sails.log.debug("enviou imagem");
                } else {
                  return res.json(500, {err: 'Erro ao fazer upload de imagem para o servidor.'});
                }
              });
          }
      });
    } else if(req.file) {
		  // BINARY

      if(req.file('avatar')._files[0].stream.byteCount <= 100){
        return res.json(400, {err: 'Arquivo inválido.'});
      }

      req.file('avatar').upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/images/tempUploads'),
        saveAs: nomeFinal
      }, function whenDone(err, uploadedFiles) {
        if (err) {
          return res.json(500, {err: 'Erro ao fazer upload do arquivo.'});
        }
        // Se não enviou nenhum arquivo
        if (uploadedFiles.length === 0) {
          return res.json(400, {err: 'Nenhum arquivo foi enviado.'});
        }
        // Se não é imagem
        if (uploadedFiles[0].type.split('/')[0] != 'image') {
          return res.json(400, {err: 'O arquivo deve ser uma imagem.'});
        }
        cloudinary.uploader.upload(require('path').resolve(sails.config.appPath, 'assets/images/tempUploads') + '/' + nomeFinal,
          function (result) {
            // Delete imagem temporaria
            fs.unlinkSync(require('path').resolve(sails.config.appPath, 'assets/images/tempUploads') + '/' + nomeFinal);
            sails.log.debug(result);
            // se deu certo
            if (result.secure_url) {
              User.update(userAtivo.id, {
                avatarUrl: result.secure_url
              })
                .exec(function (err, userAtualizado) {
                  if (err) return res.negotiate(err);
                  if (userAtualizado[0]) {
                    return res.json(200, {user: userAtualizado[0]});
                  } else {
                    return res.json(404, {err: 'Usuário não encontrado.'});
                  }
                });
              sails.log.debug("enviou imagem");
            } else {
              return res.json(500, {err: 'Erro ao fazer upload de imagem para o servidor.'});
            }
          });
      });
    } else {
      return res.json(400, {err: 'Arquivo inválido.'});
    }
	}

};
